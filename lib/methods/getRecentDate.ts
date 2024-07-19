export const getRecentDatefromObject = (data: any) => {
    const mostRecentDate = Object.values(data).reduce((latest: any, current: any) => {
        const currentCreatedAt = new Date(current.createdAt);
        return currentCreatedAt > latest ? currentCreatedAt : latest;
    }, new Date(0));

    return mostRecentDate
}

export const getRecentDatefromObjectArray = (data: any) => {
    let newestReservation = new Date(2);

    for (const roomKey in data) {
        const room = data[roomKey];
        for (const reservation of room.reservations) {
            const createdAtDate = new Date(reservation.createdAt);
            if (!newestReservation || createdAtDate > newestReservation) {
                newestReservation = createdAtDate
            }
        }
    }

    return newestReservation;
}   