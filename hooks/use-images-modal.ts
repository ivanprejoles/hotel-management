import { create } from "zustand";


interface useImages {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useImageModal = create<useImages>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))