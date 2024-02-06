import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClan } from "../../models/IClan";
import { RootState } from "../store";
import { IPlayer } from "models/IPlayer";

interface ClanState {
  clan: IClan | null;
  error: string | null;
  isLoading: boolean;
  players: IPlayer[];
}

const initialState: ClanState = {
  clan: null,
  error: null,
  isLoading: false,
  players: [],
};

const clanSlice = createSlice({
  name: "clan",
  initialState,
  reducers: {
    setClan: (state, action: PayloadAction<IClan>) => {
      state.clan = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateClanField: (
      state,
      action: PayloadAction<{ field: keyof IClan; value: any }>
    ) => {
      if (state.clan) {
        const { field, value } = action.payload;
        (state.clan[field] as (typeof state.clan)[keyof IClan]) = value;
      }
    },
    setPlayers: (state, action: PayloadAction<IPlayer[]>) => {
      state.players = action.payload;
    },
    setPlayerWins: (
      state,
      action: PayloadAction<{ playerWins: number; index: number }>
    ) => {
      const trueIndex = state.players.findIndex(
        (p) => p.id === action.payload.index
      );
      if (trueIndex !== -1) {
        state.players[trueIndex].wins = action.payload.playerWins;
      }
    },
    setPlayerGames: (
      state,
      action: PayloadAction<{ playerGames: number; index: number }>
    ) => {
      const trueIndex = state.players.findIndex(
        (p) => p.id === action.payload.index
      );
      if (trueIndex !== -1) {
        state.players[trueIndex].total_games = action.payload.playerGames;
      }
    },
  },
});

export const {
  setClan,
  setLoading,
  updateClanField,
  setError,
  setPlayers,
  setPlayerGames,
  setPlayerWins,
} = clanSlice.actions;

export const selectClan = (state: RootState) => state.clan.clan;
export const selectLoading = (state: RootState) => state.clan.isLoading;
export const selectError = (state: RootState) => state.clan.error;
export const selectPlayers = (state: RootState) => state.clan.players;

export default clanSlice.reducer;
