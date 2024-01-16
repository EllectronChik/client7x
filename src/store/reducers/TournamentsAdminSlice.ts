import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMatch } from "models/IMatch";
import { ITournamentAdmin } from "models/ITournamentAdmin";
import { RootState } from "store/store";




interface IMatches {
    [key: number]: {
        [key: number]: IMatch
    }
}

interface IMapNames {
    [key: number]: string
}

interface IBooleanDict {
    [key: number]: boolean
}

interface ITournamentsSlice {
    matches: IMatches,
    mapNames: IMapNames,
    matchShowed: IBooleanDict,
    tournamentsData: ITournamentAdmin[],
}

const initialState: ITournamentsSlice = {
    matches: {},
    mapNames: {},
    matchShowed: {},
    tournamentsData: []
}

export const tournamentsAdminSlice = createSlice({
    name: "tournamentsAdmin",
    initialState,
    reducers: {
        setMatches: (state, action: PayloadAction<{tournamentId: number, matches: IMatch[]}>) => {
            state.matches[action.payload.tournamentId] = action.payload.matches
        },
        setMapNames: (state, action: PayloadAction<{matchId: number, mapNames: string}>) => {
            state.mapNames[action.payload.matchId] = action.payload.mapNames
        },
        setMatchShowed: (state, action: PayloadAction<{tournamentId: number, showed: boolean}>) => {
            state.matchShowed[action.payload.tournamentId] = action.payload.showed
        },
        setTournamentsData: (state, action: PayloadAction<ITournamentAdmin[]>) => {
            state.tournamentsData = action.payload
        }
    }
})

export const selectMatches = (state: RootState) => state.tournamentsAdmin.matches
export const selectMapNames = (state: RootState) => state.tournamentsAdmin.mapNames
export const selectMatchShowed = (state: RootState) => state.tournamentsAdmin.matchShowed
export const selectTournamentsData = (state: RootState) => state.tournamentsAdmin.tournamentsData

export const {
    setMatches,
    setMapNames,
    setMatchShowed,
    setTournamentsData,
} = tournamentsAdminSlice.actions

export default tournamentsAdminSlice.reducer