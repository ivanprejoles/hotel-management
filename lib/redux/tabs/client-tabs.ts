
import { produce } from 'immer';
import { createSlice } from "@reduxjs/toolkit"
import { clientRoomState } from '../slices/client-room-slice';

type initialStateType = {
    // user: {[key: string]: },
    rooms: {[key: string]: clientRoomState}
}

const initialState: initialStateType = {
    rooms: {}
}

const clientSlice = createSlice({
    name: 'client-tab',
    initialState,
    reducers: {
        addRooms: (state = initialState, action) => {
            return produce(state, (draftState: any) => {
                draftState.rooms = {...draftState.rooms, ...action.payload}
            })
        },
        addSchedule: (state = initialState, action) => {
            return produce(state, (draftState: any) => {
                draftState.rooms[action.payload.id].reservations = [...draftState.rooms[action.payload.id].reservations, ...action.payload.reservations]
            })
        }
    }
})

export const {
    addRooms,
    addSchedule,
} = clientSlice.actions

export default clientSlice.reducer