import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClan } from "../../models/IClan";
import { RootState } from "../store";


interface ClanState {
    clan: IClan | null,
    error: string | null,
    isLoading: boolean,
}

const initialState: ClanState = {
    clan: null,
    error: null,
    isLoading: false,
}

const clanSlice = createSlice({
    name: 'clan',
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
        updateClanField: (state, action: PayloadAction<{ field: keyof IClan; value: any }>) => {
            if (state.clan) {
                const { field, value } = action.payload;
                (state.clan[field] as typeof state.clan[keyof IClan]) = value;
            };
        }

    }
})


export const { setClan, setLoading, updateClanField, setError } = clanSlice.actions;

export const selectClan = (state: RootState) => state.clan.clan;
export const selectLoading = (state: RootState) => state.clan.isLoading;
export const selectError = (state: RootState) => state.clan.error;

export default clanSlice.reducer;