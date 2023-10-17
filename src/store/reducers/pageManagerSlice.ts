
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface PageManagerState {
    page: number | null;
}

const initialState: PageManagerState = {
    page: null,
}

const pageManagerSlice = createSlice({
    name: 'pageManager',
    initialState,
    reducers: {
        setPageManager: (state, action) => {
            state.page = action.payload;
        },
    },
})

export const selectManagerPage = (state: RootState) => state.pageManager.page;

export const { setPageManager } = pageManagerSlice.actions;
export default pageManagerSlice.reducer;