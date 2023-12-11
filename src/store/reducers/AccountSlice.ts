import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAccountSlice {
    teamRegistred: boolean | null,
    localTime: string | null,
    globalTime: string | null,
    canRegister: boolean | null,
    isInitialLoad: boolean[],
    isStaff: boolean | null,
    isManager: boolean | null
}

const initialState: IAccountSlice = {
    teamRegistred: null,
    localTime: null,
    globalTime: null,
    canRegister: null,
    isInitialLoad: [true, true],
    isStaff: null,
    isManager: null
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
        setGlobalTime: (state, action) => {
            state.globalTime = action.payload
        },
        setCanRegister: (state, action) => {
            state.canRegister = action.payload
        },
        setIsInitialLoadFirst: (state, action) => {
            state.isInitialLoad[0] = action.payload
        },
        setIsInitialLoadSecond: (state, action) => {
            state.isInitialLoad[1] = action.payload
        },
        setIsStaff: (state, action) => {
            state.isStaff = action.payload
        },
        setIsManager: (state, action) => {
            state.isManager = action.payload
        }
        
    }
})

export const selectTeamRegistred = (state: RootState) => state.account.teamRegistred;
export const selectLocalTime = (state: RootState) => state.account.localTime;
export const selectGlobalTime = (state: RootState) => state.account.globalTime;
export const selectCanRegister = (state: RootState) => state.account.canRegister;
export const selectIsInitialLoad = (state: RootState) => state.account.isInitialLoad;
export const selectIsStaff = (state: RootState) => state.account.isStaff;
export const selectIsManager = (state: RootState) => state.account.isManager;


export const {  setTeamRegistred, 
                setLocalTime, 
                setGlobalTime, 
                setCanRegister, 
                setIsInitialLoadFirst, 
                setIsInitialLoadSecond,
                setIsManager,
                setIsStaff } = accountSlice.actions
export default accountSlice.reducer