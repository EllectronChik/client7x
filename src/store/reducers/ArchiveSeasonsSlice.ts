import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISeason } from "models/ISeason";
import { RootState } from "store/store";

interface ISeasonData extends ISeason {
  winner: string;
}

interface IArchive {
  seasons: ISeasonData[];
  page: number;
  fetching: boolean;
  nextPage: string | null;
  sortDirection: number;
}

const initialState: IArchive = {
  seasons: [],
  page: 1,
  fetching: true,
  nextPage: null,
  sortDirection: 1,
};

const archiveSeasonsSlice = createSlice({
  name: "archiveSeasons",
  initialState,
  reducers: {
    setSeasons(state, action: PayloadAction<ISeasonData[]>) {
      state.seasons = action.payload;
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

export const selectSeasons = (state: RootState) => state.archiveSeasons.seasons;
export const selectPage = (state: RootState) => state.archiveSeasons.page;
export const selectFetching = (state: RootState) =>
  state.archiveSeasons.fetching;
export const selectNextPage = (state: RootState) =>
  state.archiveSeasons.nextPage;
export const selectSortDirection = (state: RootState) =>
  state.archiveSeasons.sortDirection;

export const {
  setSeasons,
  setPage,
  setFetching,
  setNextPage,
  setSortDirection,
} = archiveSeasonsSlice.actions;
export default archiveSeasonsSlice.reducer;
