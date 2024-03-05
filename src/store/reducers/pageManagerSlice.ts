import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface PageManagerState {
  page: number | null;
  firstLoad: boolean;
}

const initialState: PageManagerState = {
  page: null,
  firstLoad: true,
};

const pageManagerSlice = createSlice({
  name: "pageManager",
  initialState,
  reducers: {
    setPageManager: (state, action) => {
      state.page = action.payload;
    },
    setFirstLoad: (state, action) => {
      state.firstLoad = action.payload;
    },
  },
});

export const selectManagerPage = (state: RootState) => state.pageManager.page;
export const selectManagerFirstLoad = (state: RootState) =>
  state.pageManager.firstLoad;

export const { setPageManager, setFirstLoad } = pageManagerSlice.actions;
export default pageManagerSlice.reducer;
