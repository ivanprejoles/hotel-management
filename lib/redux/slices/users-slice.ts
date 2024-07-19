export type userReservation = {
    roomTitle: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date
}

export type userState = {
    id: string;
    email: string;
    referenceCode: string;
    tokens: number;
    createdAt: Date;
    reservations: userReservation[];
}