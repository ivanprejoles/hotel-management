import { create } from "zustand";

interface usePayment {
    reference: string,
    paymentDue: number,
    previousPayment: number,
    roomReference: string,
    isOpen: boolean,
    onOpenPayment: ({reference, paymentDue, previousPayment, roomReference}: {reference: string, paymentDue: number, previousPayment: number, roomReference: string}) => void,
    onClose: () => void,
}

export const usePaymentModal = create<usePayment>((set) => ({
    reference: '',
    paymentDue: 0,
    previousPayment: 0,
    roomReference: '',
    isOpen: false,
    onOpenPayment: (data) => set({isOpen: true, reference: data.reference, paymentDue: data.paymentDue, previousPayment: data.previousPayment, roomReference: data.roomReference}),
    onClose: () => set({isOpen: false})
}))