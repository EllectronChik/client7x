import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IClan } from "models/IClan";
import { IGroup } from "models/IGroup";


export const GroupApi = createApi({
    reducerPath: 'GroupService',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        fetchGroups: builder.query<IGroup[], number | undefined>({
            query: (season) => ({
                url: `groupStages/?season=${season}`,
                method: "GET",
            }),
        }),
        randomizeGroups: builder.query<IGroup[], {Season: number, groupCnt: number, token: string}>({
            query: ({Season, groupCnt, token}) => ({
                url: `randomizeGroups/?season=${Season}&groupCnt=${groupCnt}`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                },

            }),
        }),
        registredTeams: builder.query<{team: IClan}[], number | undefined>({
            query: (season) => ({
                url: `getRegistred/?Season=${season}`,
                method: "GET",
            }),
        })
    }),
})