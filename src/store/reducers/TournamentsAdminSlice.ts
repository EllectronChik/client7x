import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMatch } from "models/IMatch";
import { ITournamentAdmin } from "models/ITournamentAdmin";
import { RootState } from "store/store";

interface IMatches {
  [key: number]: {
    [key: number]: IMatch;
  };
}

interface IMapNames {
  [key: number]: string;
}

interface ILocalTimes {
  [key: number]: string;
}

interface IMatchEdit {
  [key: number]: boolean;
}

interface ITournamentsSlice {
  matches: IMatches;
  mapNames: IMapNames;
  tournamentsData: ITournamentAdmin[];
  localTimes: ILocalTimes;
  matchEdit: IMatchEdit;
}

const initialState: ITournamentsSlice = {
  matches: {},
  mapNames: {},
  tournamentsData: [],
  localTimes: {},
  matchEdit: {},
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
    setMapNames: (
      state,
      action: PayloadAction<{ matchId: number; mapNames: string }>
    ) => {
      state.mapNames[action.payload.matchId] = action.payload.mapNames;
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
  },
});

export const selectMatches = (state: RootState) =>
  state.tournamentsAdmin.matches;
export const selectMapNames = (state: RootState) =>
  state.tournamentsAdmin.mapNames;
export const selectTournamentsData = (state: RootState) =>
  state.tournamentsAdmin.tournamentsData;
export const selectLocalTimes = (state: RootState) =>
  state.tournamentsAdmin.localTimes;
export const selectMatchEdit = (state: RootState) =>
  state.tournamentsAdmin.matchEdit;

export const {
  setMatches,
  setMapNames,
  setTournamentsData,
  setLocalTimes,
  setMatchEdit,
} = tournamentsAdminSlice.actions;

export default tournamentsAdminSlice.reducer;
