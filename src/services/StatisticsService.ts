import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

interface IStatistics {
  playerCnt: number;
  maxTeamsInSeasonCnt: number;
  playerGmLeagueCnt: number;
  playerMLeagueCnt: number;
  playerDmLeagueCnt: number;
  otherLeaguesCnt: number;
  playerZergCnt: number;
  playerTerranCnt: number;
  playerProtossCnt: number;
  playerRandomCnt: number;
  inSeasonTeams: {
    [teamId: string]: number;
  };
  matchesCnt: number;
  pvzCnt: number;
  tvpCnt: number;
  tvzCnt: number;
  pvzProtossWins: number;
  tvpTerranWins: number;
  tvzTerranWins: number;
  mirrorsCnt: number;
}

export const StatisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),

  tagTypes: ["statistics"],
  endpoints: (builder) => ({
    fetchStatistics: builder.query<IStatistics, void>({
      query: () => ({
        url: `/getStatistics/`,
        method: "GET",
      }),
    }),
  }),
});
