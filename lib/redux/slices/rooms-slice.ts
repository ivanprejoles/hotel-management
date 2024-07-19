import { $Enums } from '@prisma/client';

export type roomReservation = {
    id: string;
    startDate: Date;
    endDate: Date;
    paid: boolean;
    totalValue: number;
    value: number;
    user: {
        id: string;
        email: string;
        number: string;
        referenceCode: string;
    };
    createdAt: Date;
}

export type roomState = {
    id: string;
    title: string;
    status: $Enums.RoomStatus;
    reservations: roomReservation[];
}