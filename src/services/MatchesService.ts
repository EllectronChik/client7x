import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IMatch } from './../assets/images/models/IMatch';

export const MatchesApi = createApi({
    reducerPath: 'matchesApi',
    baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL,
    }),

    tagTypes: ['matches'],
    endpoints: (builder) => ({
        fetchAllMatches: builder.query<IMatch[], number>({
            query: (limit: number = 30) => ({
                method: 'GET',
                url: '/matches',
                params: {
                    _limit: limit
                }
            }),
            providesTags: result => ['matches']
        })
    })
})