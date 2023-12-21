import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/store";

interface IMatchesSlice {
    inputValues: string[][][][];
    selectedTeams: number[][];
}

const initialState: IMatchesSlice = {
    inputValues: [],
    selectedTeams: [],
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
        }
    }
})

export const { setInputValues, setSelectedTeams } = matchesSlice.actions

export const selectInputValues = (state: RootState) => state.matches.inputValues
export const selectSelectedTeams = (state: RootState) => state.matches.selectedTeams

export default matchesSlice.reducer