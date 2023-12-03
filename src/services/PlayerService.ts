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
        }),
        postPlayerToSeason: builder.mutation<void, {player: IPlayer, token: string, season: number}>({
            query: ({player, token, season}) => ({
                url: `/player_to_tournament/`,
                method: "POST",
                body: {
                    player: player,
                    season: season
                },
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        }),
        deletePlayerFromSeason: builder.mutation<void, {player_id: number, token: string}>({
            query: ({player_id, token}) => ({
                url: `/player_to_tournament/${player_id}/`,
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        })
    })
})