import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMap } from "models/IMap";
import { IMatch } from "models/IMatch";
import { ITournamentApiResponse } from "models/ITournamentApiResponse";
import { RootState } from "store/store";

interface IMatches {
  [key: number]: {
    [key: number]: IMatch;
  };
}
interface IBooleanDict {
  [key: number]: boolean;
}

interface ITournamentsSlice {
  matches: IMatches;
  matchShowed: IBooleanDict;
  tournamentsData: ITournamentApiResponse[];
  unstartedTournaments: number[];
  maps: IMap[];
}

const initialState: ITournamentsSlice = {
  matches: {},
  matchShowed: {},
  tournamentsData: [],
  unstartedTournaments: [],
  maps: [],
};

export const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    setMatches: (
      state,
      action: PayloadAction<{ tournamentId: number; matches: IMatch[] }>
    ) => {
      for (const match of action.payload.matches) {
        if (!state.matches[action.payload.tournamentId]) {
          state.matches[action.payload.tournamentId] = {};
        }
        state.matches[action.payload.tournamentId][match.id] = match;
      }
      if (action.payload.matches.length === 0) {
        state.matches[action.payload.tournamentId] = {};
      }
    },
    updateMatch: (
      state,
      action: PayloadAction<{ tournamentId: number; match: IMatch }>
    ) => {
      state.matches[action.payload.tournamentId][action.payload.match.id] =
        action.payload.match;
    },
    setMatchShowed: (
      state,
      action: PayloadAction<{ tournamentId: number; showed: boolean }>
    ) => {
      state.matchShowed[action.payload.tournamentId] = action.payload.showed;
    },
    setTournamentsData: (
      state,
      action: PayloadAction<ITournamentApiResponse[]>
    ) => {
      state.tournamentsData = action.payload;
    },
    setUnstartedTournaments: (state, action: PayloadAction<number>) => {
      state.unstartedTournaments.push(action.payload);
    },
    deleteUnstartedTournament: (state, action: PayloadAction<number>) => {
      const index = state.unstartedTournaments.findIndex(
        (p) => p === action.payload
      );
      if (index !== -1) {
        state.unstartedTournaments.splice(index, 1);
      }
    },
    setMaps: (state, action: PayloadAction<IMap[]>) => {
      state.maps = action.payload;
    },
  },
});

export const selectMatches = (state: RootState) => state.tournaments.matches;
export const selectMatchShowed = (state: RootState) =>
  state.tournaments.matchShowed;
export const selectTournamentsData = (state: RootState) =>
  state.tournaments.tournamentsData;
export const selectUnstartedTournaments = (state: RootState) =>
  state.tournaments.unstartedTournaments;
export const selectMaps = (state: RootState) => state.tournaments.maps;

export const {
  setMatches,
  updateMatch,
  setMatchShowed,
  setTournamentsData,
  setUnstartedTournaments,
  deleteUnstartedTournament,
  setMaps,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
