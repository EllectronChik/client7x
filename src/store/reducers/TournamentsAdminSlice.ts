import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMap } from "models/IMap";
import { IMatch } from "models/IMatch";
import { ITournamentAdmin } from "models/ITournamentAdmin";
import { RootState } from "store/store";

interface IMatches {
  [key: number]: {
    [key: number]: IMatch;
  };
}

interface ILocalTimes {
  [key: number]: string;
}

interface IMatchEdit {
  [key: number]: boolean;
}

interface ITournamentsSlice {
  matches: IMatches;
  tournamentsData: ITournamentAdmin[];
  localTimes: ILocalTimes;
  matchEdit: IMatchEdit;
  maps: IMap[];
}

const initialState: ITournamentsSlice = {
  matches: {},
  tournamentsData: [],
  localTimes: {},
  matchEdit: {},
  maps: [],
};

export const tournamentsAdminSlice = createSlice({
  name: "tournamentsAdmin",
  initialState,
  reducers: {
    setMatches: (
      state,
      action: PayloadAction<{ tournamentId: number; matches: IMatch[] }>
    ) => {
      state.matches[action.payload.tournamentId] = action.payload.matches;
    },
    setTournamentsData: (state, action: PayloadAction<ITournamentAdmin[]>) => {
      state.tournamentsData = action.payload;
    },
    setLocalTimes: (
      state,
      action: PayloadAction<{ tournamentId: number; localTime: string }>
    ) => {
      state.localTimes[action.payload.tournamentId] = action.payload.localTime;
    },
    setMatchEdit: (
      state,
      action: PayloadAction<{ matchId: number; edit: boolean }>
    ) => {
      state.matchEdit[action.payload.matchId] = action.payload.edit;
    },
    setMaps: (state, action: PayloadAction<IMap[]>) => {
      state.maps = action.payload;
    },
  },
});

export const selectMatches = (state: RootState) =>
  state.tournamentsAdmin.matches;
export const selectTournamentsData = (state: RootState) =>
  state.tournamentsAdmin.tournamentsData;
export const selectLocalTimes = (state: RootState) =>
  state.tournamentsAdmin.localTimes;
export const selectMatchEdit = (state: RootState) =>
  state.tournamentsAdmin.matchEdit;
export const selectMaps = (state: RootState) => state.tournamentsAdmin.maps;

export const {
  setMatches,
  setTournamentsData,
  setLocalTimes,
  setMatchEdit,
  setMaps,
} = tournamentsAdminSlice.actions;

export default tournamentsAdminSlice.reducer;
