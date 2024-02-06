import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "store/store"

interface IPrevSeasons {
    [key: string]: {
      tournamentsCount: number,
      winner: string | null
    }
  }
  
interface ILeagueCnt {
    [key: string]: number
}

interface IStartPageState {
    seasonState: number,
    tours: IInfoTours,
    seasonNumber: number,
    gridRow: number,
    previusSeasons: IPrevSeasons,
    leaguesCnt: ILeagueCnt
}

const initialState: IStartPageState = {
    seasonState: -1,
    tours: {} as IInfoTours,
    seasonNumber: 0,
    gridRow: 0,
    previusSeasons: {} as IPrevSeasons,
    leaguesCnt: {} as ILeagueCnt
}

const startPageSlice = createSlice({
    name: "startPage",
    initialState,
    reducers: {
        setSeasonState: (state, action: PayloadAction<number>) => {
            state.seasonState = action.payload
        },
        setTours: (state, action: PayloadAction<IInfoTours>) => {
            state.tours = action.payload
        },
        setSeasonNumber: (state, action: PayloadAction<number>) => {
            state.seasonNumber = action.payload
        },
        setGridRow: (state, action: PayloadAction<number>) => {
            state.gridRow = action.payload
        },
        setPreviusSeasons: (state, action: PayloadAction<IPrevSeasons>) => {
            state.previusSeasons = action.payload
        },
        setLeaguesCnt: (state, action: PayloadAction<ILeagueCnt>) => {
            state.leaguesCnt = action.payload
        }
    }
})

export const selectSeasonState = (state: RootState) => state.startPage.seasonState
export const selectTours = (state: RootState) => state.startPage.tours
export const selectSeasonNumber = (state: RootState) => state.startPage.seasonNumber
export const selectGridRow = (state: RootState) => state.startPage.gridRow
export const selectPreviusSeasons = (state: RootState) => state.startPage.previusSeasons
export const selectLeaguesCnt = (state: RootState) => state.startPage.leaguesCnt

export const {
    setSeasonState,
    setTours,
    setSeasonNumber,
    setGridRow,
    setPreviusSeasons,
    setLeaguesCnt
} = startPageSlice.actions
export default startPageSlice.reducer

