import { createAction, createSlice } from "@reduxjs/toolkit";
import { IPlayer } from "models/IPlayer";
import { RootState } from "../store";

interface PlayerListState {
  players: IPlayer[];
  error: string | null;
  isLoading: boolean;
}

const initialState: PlayerListState = {
  players: [],
  error: null,
  isLoading: false,
};

export const setPlayerList = createAction<IPlayer[]>(
  "playerList/setPlayerList"
);
export const setLoading = createAction<boolean>("playerList/setLoading");
export const setError = createAction<string | null>("playerList/setError");
export const updatePlayerList = createAction<IPlayer[]>(
  "playerList/updatePlayerList"
);
export const updatePlayerField = createAction<{
  playerId: number;
  field: keyof IPlayer;
  value: any;
}>("playerList/updatePlayerField");

export const playerListSlice = createSlice({
  name: "playerList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setPlayerList, (state, action) => {
        state.players = action.payload;
      })
      .addCase(setLoading, (state, action) => {
        state.isLoading = action.payload;
      })
      .addCase(setError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePlayerList, (state, action) => {
        action.payload.forEach((player) => {
          const index = state.players.findIndex((p) => p.id === player.id);
          if (index !== -1) {
            state.players[index] = player;
          } else {
            state.players.push(player);
          }
        });
      })
      .addCase(updatePlayerField, (state, action) => {
        const { playerId, field, value } = action.payload;
        const playerIndex = state.players.findIndex(
          (player) => player.id === playerId
        );
        if (playerIndex !== -1) {
          (state.players[playerIndex][field] as any) = value;
        }
      });
  },
});

export const selectPlayerList = (state: RootState) => state.players.players;
export default playerListSlice.reducer;
