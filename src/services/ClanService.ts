import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IPlayer } from "models/IPlayer";


export const ClanApi = createApi({
    reducerPath: "clanApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ["clan"],
    endpoints: (builder) => ({
        fetchClanMembers: builder.query<IPlayer[], string>({
            query: (tag) => ({
                url: `/get_players/${tag}/`,
                method: "GET",
            })
        })
    })
})