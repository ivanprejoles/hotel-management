'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { toLocaleDatestring } from '@/lib/changeDateTime'

import { Button } from '@/components/ui/button'
import { RoomSchedules } from '@/app/(admin)/admin/(pages)/rooms/_components/room-schedule'

interface UserInfo {
    email: string,
    referenceCode: string,
    tokens: number,
    createdAt: Date,
    number: string,
}

interface UserReservation {
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    room: {
        title:string
    },
    totalValue: number,
    value: number
}

const AccountPage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [userReservation, setUserReservation] = useState<UserReservation[]>([])
    
    useEffect(() => {
        const getUserSchedule = async () => {
            await axios.post('/api/client/userSchedule')
                .then((response) => {
                    const {reservations, ...other} = response.data

                    toast.success('User Information', {
                        description: 'User information fetched',
                      })

                    setUserInfo(other)
                    setUserReservation(reservations)
                })
                .catch((error) => {
                    console.log(error)
                    toast.error('User Information', {
                        description: 'Error etching user information',
                      })
                })
        }

        getUserSchedule()
    }, [])

    const arraySchedule = userReservation.map((reservation) => {
        return {
            room: reservation.room.title,
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate),
            ['total Payment']: reservation.totalValue,
            payment: reservation.value,
            ['scheduled At']: new Date(reservation.createdAt),
        }
    })

    return (
        <>
            <div className="w-full h-12 border-b-2 p-2 flex flex-row items-center">
                <Link href='/'>
                    <Button variant='link' className='text-lg'>Home</Button>
                </Link>
            </div>
            <div className="flex-1 relative h-full scroll overflow-x-auto">
                <div className="w-full h-auto p-2 relative border-b-2 ">
                    <div className="w-full h-auto p-2">
                        <h1 className="text-lg font-bold ">Your Information</h1>
                        <p className="text-gray-600 text-sm">Your personal infomation with user reference as essential information</p>
                    </div>
                    <div className="h-[21rem] w-full relative">
                        <div className='flex flex-row h-full w-full overflow-y-hidden scroll'>
                            <div className="flex flex-nowrap h-full w-max space-x-4 p-2">
                                <div className="bg-white relative p-4 shadow-md rounded-lg h-full min-w-[25rem] w-auto ring-slate-200 ring-1">
                                    <div className="w-11 h-11 mb-6 rounded-full p-1 bg-gradient-to-br from-black via-[#1E3F78] to-cyan-40">
                                        <div className="w-full h-full rounded-full p-2 bg-white">
                                            <User2Icon className='w-full h-full text-[#1E3F78]' />
                                        </div>
                                    </div>
                                    <div className=" h-auto w-full">
                                        {userInfo && (
                                            <>
                                                <p className="text-base font-normal h-auto">
                                                    <label htmlFor="startDate" className="text-sm font-semibold text-black">
                                                        Number: 
                                                    </label>{' ' +(!userInfo.number || userInfo.number === 'undefined' ? 'None' : userInfo.number)}
                                                </p>
                                                <p className="text-base font-normal h-auto">
                                                    <label htmlFor="startDate" className="text-sm font-semibold text-black">
                                                        User Reference: 
                                                    </label>{' '+userInfo.referenceCode}
                                                </p>
                                                <p className={cn(
                                                    "text-base font-normal h-auto",
                                                )}>
                                                    <label htmlFor="startDate" className="text-sm font-semibold text-black">
                                                        Token: 
                                                    </label>{' '+userInfo.tokens}
                                                </p>
                                                <p
                                                    className={cn(
                                                    "text-base font-normal h-auto",
                                                )}>
                                                    <label htmlFor="startDate" className="text-sm font-semibold text-black">
                                                        Account Created: 
                                                    </label>{' '+toLocaleDatestring(userInfo.createdAt)}
                                                </p>
                                                <p className="text-base font-normal h-auto">
                                                    <label htmlFor="startDate" className="text-sm font-bold text-black">
                                                    Email: 
                                                    </label>{' '+userInfo.email}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-auto p-2 relative bg-[#F9F9F9] border-b-2 ">
                        <div className="w-full h-auto p-2">
                            <h1 className="text-lg font-bold ">Schedule</h1>
                            <p className="text-gray-600 text-sm">Information of your schedules.</p>
                        </div>
                        <div className="h-auto w-full relative">
                            <RoomSchedules data={arraySchedule} user={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountPage