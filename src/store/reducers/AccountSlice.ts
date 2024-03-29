import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IPlayer } from "models/IPlayer";

interface IAccountSlice {
  teamRegistred: boolean | null;
  localTime: string | null;
  globalTime: string | null;
  canRegister: boolean | null;
  isInitialLoad: boolean[];
  initLoadSum: number;
  isStaff: boolean | null;
  isManager: boolean | null;
  regPlayers: IPlayer[];
}

const initialState: IAccountSlice = {
  teamRegistred: null,
  localTime: null,
  globalTime: null,
  canRegister: null,
  isInitialLoad: [true, true, true],
  initLoadSum: 0,
  isStaff: null,
  isManager: null,
  regPlayers: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setTeamRegistred: (state, action) => {
      state.teamRegistred = action.payload;
    },
    setLocalTime: (state, action) => {
      state.localTime = action.payload;
    },
    setGlobalTime: (state, action) => {
      state.globalTime = action.payload;
    },
    setCanRegister: (state, action) => {
      state.canRegister = action.payload;
    },
    setIsInitialLoadFirst: (state, action) => {
      state.isInitialLoad[0] = action.payload;
    },
    setIsInitialLoadSecond: (state, action) => {
      state.isInitialLoad[1] = action.payload;
    },
    setIsInitialLoadThird: (state, action) => {
      state.isInitialLoad[2] = action.payload;
    },
    setInitLoadSum: (state, action) => {
      state.initLoadSum = action.payload;
    },
    setIsStaff: (state, action) => {
      state.isStaff = action.payload;
    },
    setIsManager: (state, action) => {
      state.isManager = action.payload;
    },
    setRegPlayers: (state, action) => {
      state.regPlayers = action.payload;
    },
    addRegPlayer: (state, action) => {
      state.regPlayers.push(action.payload);
    },
    removeRegPlayer: (state, action) => {
      state.regPlayers = state.regPlayers.filter(
        (player) => player.id !== action.payload
      );
    },
  },
});

export const selectTeamRegistred = (state: RootState) =>
  state.account.teamRegistred;
export const selectLocalTime = (state: RootState) => state.account.localTime;
export const selectGlobalTime = (state: RootState) => state.account.globalTime;
export const selectCanRegister = (state: RootState) =>
  state.account.canRegister;
export const selectIsInitialLoad = (state: RootState) =>
  state.account.isInitialLoad;
export const selectInitLoadSum = (state: RootState) =>
  state.account.initLoadSum;
export const selectIsStaff = (state: RootState) => state.account.isStaff;
export const selectIsManager = (state: RootState) => state.account.isManager;
export const selectRegPlayers = (state: RootState) => state.account.regPlayers;

export const {
  setTeamRegistred,
  setLocalTime,
  setGlobalTime,
  setCanRegister,
  setIsInitialLoadFirst,
  setIsInitialLoadSecond,
  setIsInitialLoadThird,
  setInitLoadSum,
  setIsManager,
  setIsStaff,
  setRegPlayers,
  addRegPlayer,
  removeRegPlayer,
} = accountSlice.actions;
export default accountSlice.reducer;
