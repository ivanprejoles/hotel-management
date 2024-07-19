import { $Enums } from "@prisma/client";

export type clientRoomReservation = {
    id: string;
    startDate: Date;
    endDate: Date;
}

export type clientRoomState = {
    id: string;
    title: string;
    status: $Enums.RoomStatus;
    reservations: clientRoomReservation[];
}