import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ITournament } from "models/ITournament";


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
        })
    }),
})

