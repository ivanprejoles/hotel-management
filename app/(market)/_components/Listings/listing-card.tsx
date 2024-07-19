'use client';

import { Button } from "@/components/ui/button";
import { useRoomModal } from "@/hooks/use-room-modal";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "./rent-listings";

import { useRoomDetails, roomDetailsType } from "@/hooks/use-image-details";
import { clientRoomState } from "@/lib/redux/slices/client-room-slice";
import { cn } from "@/lib/utils";
// import HeartButton from "./heart-button";
// import { Link, useNavigate } from "react-router-dom";
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useCallback, useMemo } from 'react';
// import {format} from 'date-fns';

// import useCountries from '@/app/hooks/useCountries';

// import HeartButton from '../HeartButton';
// import Button from '../Button';

// import { SafeUser, SafeListing, SafeReservation } from '@/app/types';

interface ListingCardProps {
    data: clientRoomState;
    disabled?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    disabled
}) => {
    const {onOpen} = useRoomModal()
    const { user } = useContext(UserContext);
    const {details} = useRoomDetails()
    // const navigate = useNavigate()
    // const router = useRouter();
    // const {getByValue}  = useCountries();

    // const location = getByValue(data.locationValue);

    // const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    //         e.stopPropagation();

    //         if (disabled) {
    //             return;
    //         }

    //         onAction?.(actionId);
    // }, [onAction, actionId, disabled]);

    // const price = useMemo(() => {
    //     if (reservation) {
    //         return reservation.totalPrice;
    //     }

    //     return data.price;
    // }, [reservation, data.price]);

    // const reservationDate = useMemo(() => {R
    //     if (!reservation) {
    //         return null;
    //     }

    //     const start = new Date(reservation.startDate);
    //     const end = new Date(reservation.endDate);

    //     return `${format(start, 'PP')} - ${format(end, 'PP')}`
    // }, [reservation]);

  return (
    <div 
        onClick={() => {!disabled && onOpen({
            userData: {
                id: user?.id || '',
                email: user?.email || ''
            },
            roomData: {
                roomId: data.id,
                title: data.title
            }
        })}}
        className={cn("col-span-1 cursor-pointer group", disabled && "bg-gray-400")}
    >
        <div className="flex flex-col gap-2 w-full">
            <div 
                className="
                    aspect-square
                    w-full
                    relative
                    overflow-hidden
                    rounded-xl
                "
            >
                <Image
                    priority
                    alt="House Images"
                    src={details.images[0]||'/images/house-preloader.gif'}
                    className='
                        object-cover
                        group-hover:scale-110
                        transition
                    '   width={0}
                        height={0}
                        layout="fill"
                   
                />
            </div>
            <div className="font-light text-neutral-500">
                {data.title}
            </div>
            
            <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">
                    ₱ {details.value}
                </div>
                <div className="font-light">night</div>
            </div>
        </div>
    </div>
  )
}

export default ListingCard