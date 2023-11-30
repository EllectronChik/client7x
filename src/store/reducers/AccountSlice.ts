import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAccountSlice {
    teamRegistred: boolean | null,
    localTime: string | null,
    canRegister: boolean | null,
    isInitialLoad: boolean[]
}

const initialState: IAccountSlice = {
    teamRegistred: null,
    localTime: null,
    canRegister: null,
    isInitialLoad: [true, true]

}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setTeamRegistred: (state, action) => {
            state.teamRegistred = action.payload
        },
        setLocalTime: (state, action) => {
            state.localTime = action.payload
        },
        setCanRegister: (state, action) => {
            state.canRegister = action.payload
        },
        setIsInitialLoadFirst: (state, action) => {
            state.isInitialLoad[0] = action.payload
        },
        setIsInitialLoadSecond: (state, action) => {
            state.isInitialLoad[1] = action.payload
        }
        
    }
})

export const selectTeamRegistred = (state: RootState) => state.account.teamRegistred;
export const selectLocalTime = (state: RootState) => state.account.localTime;
export const selectCanRegister = (state: RootState) => state.account.canRegister;
export const selectIsInitialLoad = (state: RootState) => state.account.isInitialLoad;

export const { setTeamRegistred, setLocalTime, setCanRegister, setIsInitialLoadFirst, setIsInitialLoadSecond } = accountSlice.actions
export default accountSlice.reducer