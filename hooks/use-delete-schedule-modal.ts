import { create } from "zustand"

interface useDelete {
    reference: string,
    text: string,
    isOpen: boolean,
    roomReference: string,
    onOpen:  ({reference, text, roomReference}: {reference: string, text: string, roomReference: string}) => void,
    onClose: () => void
}

export const useDeleteModal = create<useDelete>((set) => ({
    reference: '',
    text: '',
    isOpen: false,
    room: '',
    roomReference: '',
    onOpen: (data) => set({isOpen: true, reference: data.reference, text: data.text, roomReference: data.roomReference}),
    onClose: () => set({isOpen: false})
}))