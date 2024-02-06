import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IClan } from "models/IClan";
import { IGroup } from "models/IGroup";

export const GroupApi = createApi({
  reducerPath: "GroupService",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    fetchRegistredTeams: builder.query<IClan[], string>({
      query: (token) => ({
        url: `registredToCurrentSeasonTeams/`,
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    randmizeGroups: builder.mutation<
      IGroup[],
      { groupCnt: number; token: string }
    >({
      query: ({ groupCnt, token }) => ({
        url: `randomizeGroups/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          groupCnt: groupCnt,
        },
      }),
    }),
    fetchGroups: builder.query<IGroup[], string>({
      query: (token) => ({
        url: `groupsToCurrentSeason/`,
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    postTeamToGroup: builder.mutation<
      IGroup,
      { teamId: number; groupStageMark: string; token: string }
    >({
      query: ({ teamId, groupStageMark, token }) => ({
        url: `postTeamToGroup/`,
        method: "POST",
        body: {
          teamId: teamId,
          groupStageMark: groupStageMark,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    deleteTeamFromGroup: builder.mutation<
      IGroup,
      { teamId: number; token: string }
    >({
      query: ({ teamId, token }) => ({
        url: `deleteTeamFromGroup/`,
        method: "POST",
        body: {
          teamId: teamId,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});
