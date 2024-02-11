import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store";

export interface IClanData {
  id?: number;
  tag: string;
  name: string;
  logo: string;
  region: number;
  user: number;
}

interface IArchiveTeams {
  teams: IClanData[];
  page: number;
  fetching: boolean;
  nextPage: string | null;
  sortDirection: number;
}

const initialState: IArchiveTeams = {
  teams: [],
  page: 1,
  fetching: true,
  nextPage: null,
  sortDirection: 1,
};

const archiveSeasonsSlice = createSlice({
  name: "archiveTeams",
  initialState,
  reducers: {
    setTeams(state, action: PayloadAction<IClanData[]>) {
      state.teams = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
    setNextPage(state, action: PayloadAction<string | null>) {
      state.nextPage = action.payload;
    },
    setSortDirection(state, action: PayloadAction<number>) {
      state.sortDirection = action.payload;
    },
  },
});

export const selectTeams = (state: RootState) => state.archiveTeams.teams;
export const selectPage = (state: RootState) => state.archiveTeams.page;
export const selectFetching = (state: RootState) => state.archiveTeams.fetching;
export const selectNextPage = (state: RootState) => state.archiveTeams.nextPage;
export const selectSortDirection = (state: RootState) =>
  state.archiveTeams.sortDirection;

export const { setTeams, setPage, setFetching, setNextPage, setSortDirection } =
  archiveSeasonsSlice.actions;
export default archiveSeasonsSlice.reducer;
