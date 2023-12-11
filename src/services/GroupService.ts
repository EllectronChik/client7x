import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IClan } from "models/IClan";
import { IGroup } from "models/IGroup";


export const GroupApi = createApi({
    reducerPath: 'GroupService',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        fetchRegistredTeams: builder.query<IClan[], string>({
            query: (token) => ({
                url: `registredToCurrentSeasonTeams/`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            }),
        }),
        randomizeGroups: builder.query<IGroup[], {groupCnt: number, token: string}>({
            query: ({groupCnt, token}) => ({
                url: `randomizeGroups/?groupCnt=${groupCnt}`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                },

            }),
        }),
        fetchGroups: builder.query<{groupMark: string, teams: IClan[]}[], string>({
            query: (token) => ({
                url: `groupsToCurrentSeason/`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            }),
        })
    }),
})