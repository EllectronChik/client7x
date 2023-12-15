import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/store";

interface IMatchesSlice {
    inputValues: string[][][];
    selectedTeams: number[];
    unselectedTeams: number[][];
}

const initialState: IMatchesSlice = {
    inputValues: [],
    selectedTeams: [],
    unselectedTeams: []
}

export const matchesSlice = createSlice({
    name: "matches",
    initialState,
    reducers: {
        setInputValues: (state, action) => {
            state.inputValues = action.payload;
        },
        setSelectedTeams: (state, action) => {
            state.selectedTeams = action.payload;
        },
        setUnselectedTeams: (state, action) => {
            state.unselectedTeams = action.payload;
        }
    }
})

export const { setInputValues, setSelectedTeams, setUnselectedTeams } = matchesSlice.actions

export const selectInputValues = (state: RootState) => state.matches.inputValues
export const selectSelectedTeams = (state: RootState) => state.matches.selectedTeams
export const selectUnselectedTeams = (state: RootState) => state.matches.unselectedTeams

export default matchesSlice.reducer