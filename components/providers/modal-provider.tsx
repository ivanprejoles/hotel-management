'use client'

import { useEffect, useState } from "react";
import RoomModal from "@/components/modals/room-modal";
import ImageModal from "@/components/modals/images-modal";
import ReduxProvider from "./redux-provider";
import ScheduleDeleteModal from "../modals/shedule-delete-modal";
import UpdateScheduleModal from "../modals/schedule-payment-modal";



const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null
    }
    
    return (  
        <ReduxProvider>
            <ImageModal />
            <RoomModal />
            <ScheduleDeleteModal />
            <UpdateScheduleModal />
        </ReduxProvider>
    );
}
 
export default ModalProvider;