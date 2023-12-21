import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ITournament } from "models/ITournament";
import { ITournamentApiResponse } from "models/ITournamentApiResponse";



export const TournamentApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        fetchTournaments: builder.query<ITournament[], void>({
            query: () => ({
                url: `/getToursToCurrentSeason/`,
                method: "GET",
            }),
        }),
        postTournament: builder.mutation<void, {tournament: ITournament, token: string}>({
            query: ({tournament, token}) => ({
                url: `/tournaments/`,
                method: "POST",
                body: tournament,
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        }),
        deleteTournaments: builder.mutation<void, {token: string}>({
            query: ({token}) => ({
                url: `/deleteTournamentsToCurrentSeason/`,
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        }),
        fetchTournamentsByManager: builder.query<ITournamentApiResponse[], string>({
            query: (token) => ({
                url: `/getToursByManager/`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        }),
        setTimeSuggestion: builder.mutation<void, {id: number, timeSuggestion: string, token: string}>({
            query: ({id, timeSuggestion, token}) => ({
                url: `/setTimeSuggestion/`,
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`
                },
                body: {
                    id: id,
                    timeSuggestion: timeSuggestion
                }
            })
        }),
        acceptTimeSuggestion: builder.mutation<void, {id: number, token: string}>({
            query: ({id, token}) => ({
                url: `/acceptTimeSuggestion/`,
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`
                },
                body: {
                    id: id,
                }
            })
        })
    }),
})

