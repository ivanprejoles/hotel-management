import { createSlice } from "@reduxjs/toolkit"
import { produce } from "immer"
import { roomState, roomReservation } from "../slices/rooms-slice"
import { userReservation, userState } from "../slices/users-slice"

type initialStateType = {
    users : {[key: string]: userState},
    rooms: {[key: string]: roomState}
}

const initialState: initialStateType = {
    users: {},
    rooms: {}
}

const adminSlice = createSlice({
name: 'admin-tab',
    initialState,
    reducers: {
        // Rooms
        addRooms: (state = initialState, action) => {
            return produce(state, (draftState) => {
                draftState.rooms = {...draftState.rooms, ...action.payload}
            })
        },
        addRoom: (state = initialState, action: {
            payload: {key: string, value: roomState};
            type: string;
        }) => {
            const { key, value } = action.payload
            return produce(state, (draftState: any) => {
                draftState.rooms[key] = value
            })
        },
        addPreviousRooms: (state = initialState, action) => {
            return produce(state, (draftState: any) => {
                Object.keys(action.payload).forEach((roomId: string) => {
                    if (!draftState.rooms[roomId]) {
                        draftState.rooms[roomId] = {};
                    }
                    Object.assign(draftState.rooms[roomId], action.payload[roomId]);
                });
            })
        },
        // Users
        addUsers: (state = initialState, action) => {
            return produce(state, (draftState) => {
                draftState.users = {...draftState.users, ... action.payload}
            })
        },
        addPreviousUser: (state = initialState, action) => {
            return produce(state, (draftState: any) => {
                Object.keys(action.payload).forEach((userId: string) => {
                    // Check if the user already exists in the draftState
                    if (!draftState.users[userId]) {
                        // If user doesn't exist, create it
                        draftState.users[userId] = {};
                    }
                    // Merge the existing user data with the new partial data
                    Object.assign(draftState.users[userId], action.payload[userId]);
                });
            })
        },
        addUserSchedule: (state = initialState, action: {
            payload: {key: string, value: roomReservation[]};
            type: string,
        }) => {
            const {key, value} = action.payload
            return produce(state, (draftState: any) => {
                draftState.users[key].reservations = [
                    ...draftState.users[key].reservations,
                    ...value
                ]
            })
        },
        updateSchedule: (state = initialState, action: {
            payload: {roomReference: string, totalPayment: number, reference: string};
        }) => {
            const {roomReference, totalPayment, reference} = action.payload
            return produce(state, (draftState: any) => {
                const reservationIndex = draftState.rooms[roomReference].reservations.findIndex((reservation: any) => reservation.id === reference)
                draftState.rooms[roomReference].reservations[reservationIndex] = {
                    ...draftState.rooms[roomReference].reservations[reservationIndex],
                    value: totalPayment
                }
            })
        },
        deleteSchedule: (state = initialState, action: {
            payload: {roomReference: string, reference: string};
        }) => {
            const {roomReference, reference} = action.payload
            return produce(state, (draftState: any) => {
                const reservationIndex = draftState.rooms[roomReference].reservations.findIndex((reservation: any) => reservation.id === reference)
                const terminatedReservation = draftState.rooms[roomReference].reservations
                terminatedReservation.splice(reservationIndex, 1)
                draftState.rooms[roomReference].reservations = terminatedReservation;
            });
        }
    }
})

export const {
    addRoom,
    addRooms,
    addPreviousRooms,
    addUsers,
    addPreviousUser,
    addUserSchedule,
    updateSchedule,
    deleteSchedule
} = adminSlice.actions

export default adminSlice.reducer