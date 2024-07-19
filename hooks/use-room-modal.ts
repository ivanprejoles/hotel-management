import { create } from "zustand";

interface dataType {
    userData: {
        id: string,
        email: string,
    },
    roomData: {
        title: string,
        roomId: string
    }
}

interface useRoom {
    isOpen: boolean,
    data: dataType | {userData: {id: '', email: ''}, roomData: {roomId: '', title: ''}},
    onOpen: (data: dataType) => void,
    onClose: () => void,
}

export const useRoomModal = create<useRoom>((set) => ({
    isOpen: false,
    data: {userData: {id: '', email: ''}, roomData: {roomId: '', title: ''}},
    onOpen: (data) => set(() => ({isOpen: true, data})),
    onClose: () => set({isOpen: false}),
}))