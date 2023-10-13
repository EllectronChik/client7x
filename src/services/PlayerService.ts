import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IPlayer } from "models/IPlayer";



export const PlayerApi = createApi({
    reducerPath: "playerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ["players"],
    endpoints: (builder) => ({
        fetchPlayers: builder.query<IPlayer[], number>({
            query: (id) => ({
                url: `/players/${id}/`,
                method: "GET",
            })
        }),
        fetchPlayersByClan: builder.query<IPlayer[], number>({
            query: (id) => ({
                url: `/players?team=${id}`,
                method: "GET",
            })
        }),
        postPlayer: builder.mutation<void, {player: IPlayer, token: string}>({
            query: ({player, token}) => ({
                url: `/players/`,
                method: "POST",
                body: player,
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        })
    })
})