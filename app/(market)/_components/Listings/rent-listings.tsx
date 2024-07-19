'use client'

import React, { createContext, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { useRoomDetails } from "@/hooks/use-image-details";
import { RootState } from "@/lib/redux/store";
import { userType } from "@/lib/current-user";
import { addRooms } from "@/lib/redux/tabs/client-tabs";
import { clientRoomState } from "@/lib/redux/slices/client-room-slice";
import { useRequest } from "@/hooks/use-request-time";

import ListingCard from './listing-card';

interface RentListingsProps {
    user?: userType,
}
export const UserContext = createContext<RentListingsProps>({ user: undefined});


const RentListings = ({
    user,
}: RentListingsProps) => {
    const {clientRoomRequest, onClientRoomRequest,threeMinutesInMilliSeconds} = useRequest()
    const {updateDetails, details} = useRoomDetails()
    const dispatch = useDispatch()
    const roomTemplate = useSelector((state: RootState) => state.clientTemplate.rooms)

    useEffect(() => {

        const getRoomDetails = async () => {
            await axios.post('/api/roomDescription')
              .then((response) => {
                updateDetails(response.data)
                toast.success('Hotel Details', {
                    description: 'Hotel details fetched',
                  })
              })
              .catch((error) => {
                console.log(error)
                toast.error('Hotel Details', {
                    description: 'Error Fetching hotel details',
                  })
              })
        }

        const getRooms = async () => {
            await axios.post('/api/client/rooms')
            .then((response) => {
                const data: clientRoomState[] = response.data
                
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
                console.log(error)
                toast.error('Rooms Information', {
                    description: 'Error Fetching hotel details',
                  })
            })
            .finally(() => {
                onClientRoomRequest()
            })

        }

        //details request
        if (details.images.length <= 0) {
            getRoomDetails()
        }

        if (Object.keys(roomTemplate).length <= 0) {
            getRooms()
        } else{
            const dateToday= new Date()
            if ((dateToday.getTime() - clientRoomRequest.getTime()) > threeMinutesInMilliSeconds) {
                getRooms()
            }
        }
    }, [])

    return (
        <div
            id="Listings" 
            className='
                w-full 
                h-auto
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                2xl:grid-cols-4
                gap-8
                pt-10
                pb-10
                px-4
                '
            >
                <UserContext.Provider value={{ user }}>
                    {Object.values(roomTemplate).map((room, key) => (
                        <ListingCard 
                            key={key}
                            disabled={room.status === 'Maintenance'}
                            data={room}
                        />
                    ))}
                </UserContext.Provider>
            </div>
    )
}

export default RentListings