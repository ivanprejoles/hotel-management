import { create } from "zustand";

export type roomDetailsType = {
    title: string;
    description: string;
    value: number;
    bedrooms: number;
    images: string[];
}

interface useRoomType {
    details: roomDetailsType,
    updateDetails: (details: roomDetailsType) => void
}

export const useRoomDetails = create<useRoomType>((set) => ({
    details: {
        title: '',
        description: '', 
        value: 0,
        bedrooms: 0,
        images: [],
    },
    updateDetails: (details) => set(() => ({details}))
}))