import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlayer } from "models/IPlayer";
import { RootState } from "store/store";

interface IDragPlayer {
    playerDragged: IPlayer| null,
    playerDropped: (IPlayer | null)[],
    draggable: [number, boolean][], 
}

const initialState: IDragPlayer = {
    playerDragged: null,
    playerDropped: [],
    draggable: []
}

const dragPlayerSlice = createSlice({
    name: 'dragPlayer',
    initialState: initialState,
    reducers: {
        setDragPlayer: (state, action: PayloadAction<IPlayer | null>) => {
            state.playerDragged = action.payload
        },
        setDroppedPlayer: (state, action: PayloadAction<(IPlayer | null)[]>) => {
            action.payload.forEach((player) => {
                const index = state.playerDropped.findIndex((p) => p?.id === player?.id)
                if (index === -1) {
                    state.playerDropped.push(player)
                }
            })
        },
        deleteDroppedPlayer: (state, action: PayloadAction<number>) => {
            const index = state.playerDropped.findIndex((p) => p?.id === action.payload)
            if (index !== -1) {
                state.playerDropped.splice(index, 1)
            }
        },
        setDraggable: (state, action: PayloadAction<[number, boolean]>) => {
            const index = state.draggable.findIndex((p) => p[0] === action.payload[0])
            if (index === -1) {
                state.draggable.push(action.payload)
            } else {
                state.draggable[index] = action.payload
            }
        }
    }
})

export const selectDragPlayer = (state: RootState) => state.dragPlayer.playerDragged
export const selectDroppedPlayer = (state: RootState) => state.dragPlayer.playerDropped
export const selectDraggable = (state: RootState) => state.dragPlayer.draggable

export const { setDragPlayer, setDroppedPlayer, setDraggable, deleteDroppedPlayer } = dragPlayerSlice.actions

export default dragPlayerSlice.reducer