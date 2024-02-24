import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

interface IStatistics {
  playerCnt: number;
  maxTeamsInSeasonCnt: number;
  inSeasonTeams: {
    number: number;
    teamCount: number;
  }[];
  leagueStats: {
    league: number;
    playerCount: number;
  }[];
  raceStats: {
    race: number;
    playerCount: number;
  }[];
  matchStats: {
    totalMatches: number;
    mirrors: number;
    tvzCount: number;
    tvzTerranWins: number;
    tvpCount: number;
    tvpTerranWins: number;
    pvzCount: number;
    pvzProtossWins: number;
  }
  maps: {
    id: number;
    name: string;
    tvzCount: number;
    tvzTerranWins: number;
    tvpCount: number;
    tvpTerranWins: number;
    pvzCount: number;
    pvzProtossWins: number;
  }[]
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
