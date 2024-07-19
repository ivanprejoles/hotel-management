'use client'

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillHouseFill, BsHouse } from "react-icons/bs";
import { FaRegCalendarAlt, FaHouseUser } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { useMediaQuery } from 'usehooks-ts'
import { eachDayOfInterval } from 'date-fns'
import { Range } from 'react-date-range';
import { toast } from 'sonner'

import { RootState } from '@/lib/redux/store'
import { addPreviousRooms, addRoom, addRooms } from '@/lib/redux/tabs/admin-tab'
import { roomReservation, roomState } from '@/lib/redux/slices/rooms-slice'
import { cn } from '@/lib/utils'
import { toLocaleDatestring } from '@/lib/changeDateTime'

import { RoomSchedules } from '../_components/room-schedule'
import { Button } from '@/components/ui/button'
import Calendar from '@/components/general/calendar'

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
}

interface TableReservation {
  id: string;
  startDate: Date;
  endDate: Date;
  room: string;
  paid: boolean;
  totalValue: number;
  value: number;
  roomReference: string;
  user: {
      id: string;
      email: string;
      number: string;
      referenceCode: string;
  };
  createdAt: Date;
}


const RoomsPage = () => {
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [selectedRoom, setSelectedRoom] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const isMobile = useMediaQuery('(max-width: 1200px)')
  
  const dispatch = useDispatch()
  const roomTemplate = useSelector((state: RootState) => state.adminTemplate.rooms)

  // data fetching
  useEffect(() => {
    const getRooms = async () => {
      await axios.post('/api/rooms')
        .then((response) => {
          const data: roomState[] = response.data
          const objectResponse = data.reduce((acc: any, room: any) => {
            acc[room.id] = {...room}
            return acc
          }, {})
          
          toast.success('Rooms Information', {
            description: 'Rooms Information Fetched',
          })

          dispatch(addRooms(objectResponse))
        })
        .catch((error) => {
          toast.error('Rooms Information',{
            description: 'Error fetching room information',
          })
          console.log(error)
        })
    } 

    const getNewRooms = async () => {
      await axios.post('/api/newRooms')
        .then((response) => {

          const objectResponse = response.data.reduce((acc: any, room: any) => {
            acc[room.id] = {...room}
            return acc
          }, {})

          toast.success('Rooms Information', {
            description: 'Rooms Information Fetched',
          })

          dispatch(addPreviousRooms(objectResponse))
        })
        .catch((error) => {
          console.log(error)
          toast.error('Rooms Information',{
            description: 'Error fetching room information',
          })
        })
    }
         
    // fetching condition
    if (Object.keys(roomTemplate).length <= 0) {
      getRooms()
    } else {
      getNewRooms()
    }

  }, [])

  const selectedRoomReservations = useMemo(() => {
    return roomTemplate[selectedRoom]?.reservations || []; 
  }, [roomTemplate, selectedRoom])  

  const disabledDates = useMemo(() => {
    let dates: Date[] = []
    let schedules: any[] = [];
    let calendarReservation: TableReservation[] = (selectedRoom.length <= 0) 
      ? [] 
      : selectedRoomReservations.map(reservation => ({
        ...reservation,
        room: roomTemplate[selectedRoom].title,
        roomReference: roomTemplate[selectedRoom].id
      }))
    
    let TableReservation: TableReservation[] = Object.values(roomTemplate).flatMap(room =>
        room.reservations.map(reservation => ({
          ...reservation,
          room: room.title,
          roomReference: room.id
        }))
    )

    // calendar
    calendarReservation.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      })
      dates = range
    })

    // table reservation
    TableReservation.forEach((reservation) => { 
      schedules = [...schedules, 
        {
          email: reservation.user.email,
          number: reservation.user.number,
          payment: reservation.value,
          'payment Due': reservation.totalValue,
          'check In': new Date(reservation.startDate),
          'check Out': new Date(reservation.endDate),
          room: reservation.room,
          referenceCode: reservation.user.referenceCode,
          referenceId: reservation.id,
          roomReference: reservation.roomReference
        }
      ]
    })

    // 
    const today = new Date();
    const currentSchedules: {[key: string]: roomReservation} = {};

    Object.values(roomTemplate).forEach((room) => {
      if (!selectedRoomReservations) {
        console.log('selected room reservation')
      }
      const selectedSchedule = room.reservations.find(schedule => {
        const startDate = new Date(schedule.startDate);
        const endDate = new Date(schedule.endDate);
        return today >= startDate && today <= endDate;
      }); 
      
      if (selectedSchedule) {
        currentSchedules[room.id] = selectedSchedule;
      }
    });

    return {dates, schedules, currentSchedules}
  }, [selectedRoom, roomTemplate, selectedRoomReservations])


  const currentSchedules = useMemo(() => {
    if (selectedRoom.length <= 0) return undefined
    const today = new Date();

    return selectedRoomReservations.find(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      return today >= startDate && today <= endDate;
    })
  }, [selectedRoom, selectedRoomReservations])

  const createRoom = async () => {
    if (isLoading) return
    setIsLoading(true)
    await axios.post('/api/room', {title: 'Room '+Object.keys(roomTemplate).length})
        .then((response) => {
          dispatch(addRoom({key:response.data.id, value: response.data}))
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
  }

  const data = useMemo(() => {
    return [
      {
        Icon: BsFillHouseFill,
        title: 'Total Room',
        value: Object.keys(roomTemplate).length
      },
      {
        Icon: FaRegCalendarAlt,
        title: 'Reservation',
        value: disabledDates.schedules.length
      },
      {
        Icon: BsHouse,
        title: 'Available Units',
        value: Object.keys(roomTemplate).length - Object.keys(disabledDates.currentSchedules).length
      },
      {
        Icon: FaHouseUser,
        title: 'Check-In',
        value: Object.keys(disabledDates.currentSchedules).length
      },
      {
        Icon: MdOutlinePayments,
        title: 'Pending Payment',
        value: Object.values(disabledDates.schedules).filter((schedule) => {
          return Number(schedule.payment) < Number(schedule['payment Due']);
        }).length
      },
    ]
  }, [disabledDates, roomTemplate]) 
  
  return (
    <>
      <div className="w-full h-12 border-b-2 p-2 flex flex-row items-center">
        <Link href='/'>
          <Button variant='link' className='text-lg'>Home</Button>
        </Link>
      </div>
      <div className="flex-1 relative h-full scroll overflow-x-auto">

          <div className="w-full h-auto p-2 relative bg-[#F9F9F9] border-b-2 ">
            <div className="w-full h-auto p-2">
              <h1 className="text-lg font-bold ">Overview</h1>
              <p className="text-gray-600 text-sm">Real-time information and activities of your property.</p>
            </div>
            <div className="h-40 w-full relative">
              <div className='flex flex-row h-full w-full overflow-y-hidden scroll'>
                <div className="flex flex-nowrap h-full w-max space-x-4 p-2">

                  {data.map((item, key) => (
                    <div 
                      className="bg-white relative p-1 shadow-md rounded-lg h-full w-[10rem] bg-gradient-to-br from-black via-[#1E3F78] to-cyan-400"
                      key={key}
                    >
                      <div className="w-full h-full relative p-4 rounded-lg bg-white">
                        <div className="w-11 h-11 mb-4 md:mb-6 rounded-full p-1 bg-gradient-to-br from-black via-[#1E3F78] to-cyan-400">
                          <div className="w-full h-full rounded-full p-2 bg-white">
                            <item.Icon className='w-full h-full text-[#1E3F78]' />
                          </div>
                        </div>
                        <div className=" h-auto w-full">
                          <h2 className="text-xs text-slate-700 font-semibold h-auto">
                            {item.title}
                          </h2>
                          <p className="text-lg font-bold h-auto">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-auto p-2 relative border-b-2 ">
            <div className="w-full h-auto p-2">
              <h1 className="text-lg font-bold ">Rooms</h1>
              <Button onClick={createRoom} disabled={isLoading}>Create Room</Button>
            </div>
            <div className="h-40 w-full relative">
              <div className='flex flex-row h-full w-full overflow-y-hidden scroll'>
                <div className="flex flex-nowrap h-full w-max space-x-4 p-2">

                  {Object.entries(roomTemplate).map(([key, value], keyDiv) => (
                    <div
                      onClick={() => setSelectedRoom(key)} 
                      key={keyDiv}
                      className="group hover:scale-110 hover:shadow-md ease-in-out duration-300 transition-all bg-white cursor-pointer relative p-4 shadow-md rounded-lg h-full w-[10rem] ring-slate-200 ring-1"
                    >
                      <div className="group-hover:scale-125 delay-100 ease-in-out duration-100 w-11 h-11 mb-6 rounded-full p-1 bg-gradient-to-br from-black via-[#1E3F78] to-cyan-400 ">
                        <div className="w-full h-full rounded-full p-2 bg-white">
                          <BsFillHouseFill className='w-full h-full text-[#1E3F78]' />
                        </div>
                      </div>
                      <div className=" h-auto w-full">
                        <h2 className={cn(
                          "text-xs font-semibold h-auto shadow-sm",
                          (disabledDates.currentSchedules[key]) ? 'text-green-500' : 'text-red-500'
                        )}>
                          {(disabledDates.currentSchedules[key]) ? 'Occupied' : 'Vacant'}
                        </h2>
                        <p className="text-lg font-bold h-auto">
                          {value.title}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-auto p-2 relative border-b-2 ">
            <div className="w-full h-auto p-2">
              <h1 className="text-lg font-bold ">Room Information</h1>
              <p className="text-gray-600 text-sm">Room information and calendar schedules.</p>
            </div>
            <div className="h-[21rem] w-full relative">
              <div className='flex flex-row h-full w-full overflow-y-hidden scroll'>
                <div className="flex flex-nowrap h-full w-max space-x-4 p-2">
                  {selectedRoom.length > 0 && (
                    <div className="bg-white relative p-4 shadow-md rounded-lg h-full min-w-[25rem] w-auto ring-slate-200 ring-1">
                      <div className="w-11 h-11 mb-6 rounded-full p-1 bg-gradient-to-br from-black via-[#1E3F78] to-cyan-40">
                        <div className="w-full h-full rounded-full p-2 bg-white">
                          <BsFillHouseFill className='w-full h-full text-[#1E3F78]' />
                        </div>
                      </div>
                      <div className=" h-auto w-full">
                        <h2 className={cn(
                          "text-xs font-semibold h-auto", 
                            (disabledDates.currentSchedules[selectedRoom]) ? 'text-green-500' : 'text-red-500'
                        )}>
                          {(disabledDates.currentSchedules[selectedRoom]) ? 'Occupied' : 'Vacant'}
                        </h2>
                        <p className="text-lg font-bold h-auto">
                          {roomTemplate[selectedRoom].title}
                        </p>
                        {currentSchedules && (
                          <>
                            <p className={cn(
                              "text-base font-normal h-auto",
                              (currentSchedules.paid) ? 'text-green-400' : 'text-red-400' 
                            )}>
                              {(currentSchedules.paid) ? 'Paid' : 'Not Paid'}
                            </p>
                            <p className="text-base font-normal h-auto">
                              <label htmlFor="startDate" className="text-sm font-semibold">
                                Check In: 
                              </label>{' ' +toLocaleDatestring(currentSchedules.startDate)}
                            </p>
                            <p className="text-base font-normal h-auto">
                              <label htmlFor="startDate" className="text-sm font-semibold">
                                Check Out: 
                              </label>{' ' +toLocaleDatestring(currentSchedules.endDate)}
                            </p>
                            <p className="text-base font-normal h-auto">
                              <label htmlFor="startDate" className="text-sm font-semibold">
                                Payment: 
                              </label>{' '+currentSchedules.totalValue}
                            </p>
                            <p
                              className={cn(
                                "text-base font-normal h-auto",
                                (currentSchedules.totalValue > currentSchedules.value) ? 'text-red-400' : 'text-green-400'
                              )}>
                              <label htmlFor="startDate" className="text-sm font-semibold text-black">
                                Paid: 
                              </label>{' '+currentSchedules.value}
                            </p>
                            <p className="text-base font-normal h-auto">
                              <label htmlFor="startDate" className="text-sm font-bold text-black">
                                Email: 
                              </label>{' '+currentSchedules.user.email}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="w-auto p-1 h-full relative shadow-md border rounded-lg overflow-hidden pt-0 pb-2">
                    <Calendar
                      value = {dateRange}
                      disabledDates={disabledDates.dates}
                      onChange={(value) => setDateRange(value.selection)}
                      number={(isMobile) ? 1 : 2}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-auto p-2 relative border-b-2 ">
            <div className="w-full h-auto p-2">
              <h1 className="text-lg font-bold ">Schedule Table</h1>
              <p className="text-gray-600 text-sm">Schedule information and payment update of your users.</p>
            </div>
            <RoomSchedules data={disabledDates.schedules} />
          </div>
      </div>
    </>
  )
}

export default RoomsPage