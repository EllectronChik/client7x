import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IPlayer } from "models/IPlayer";

interface IPlayerData {
  player: IPlayer;
  matches: {
    id: number;
    map: string | null;
    opponent: string;
    opponentTag: string;
    opponentId: number;
    winner: boolean;
  }[];
}

export const PlayerApi = createApi({
  reducerPath: "playerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["players"],
  endpoints: (builder) => ({
    fetchPlayersByClan: builder.query<IPlayer[], number>({
      query: (id) => ({
        url: `/players?team=${id}`,
        method: "GET",
      }),
    }),
    postPlayer: builder.mutation<void, { player: IPlayer; token: string }>({
      query: ({ player, token }) => ({
        url: `/players/`,
        method: "POST",
        body: {
          avatar: player.avatar,
          username: player.username,
          mmr: player.mmr,
          wins: player.wins,
          total_games: player.total_games,
          region: player.region,
          battlenet_id: player.id,
          league: player.league,
          race: player.race,
          team: player.team,
          user: player.user,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    postPlayerToSeason: builder.mutation<
      void,
      { player_id: number; token: string; season: number }
    >({
      query: ({ player_id, token, season }) => ({
        url: `/player_to_tournament/`,
        method: "POST",
        body: {
          player: player_id,
          season_number: season,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    deletePlayerFromSeason: builder.mutation<
      void,
      { player_id: number; token: string }
    >({
      query: ({ player_id, token }) => ({
        url: `/player_to_tournament/${player_id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    getRegForSeasonPlayers: builder.query<
      { player: number; season: number; user: number }[],
      { token: string }
    >({
      query: ({ token }) => ({
        url: `/getPlayerToCurrentTournament/`,
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    fetchPlayerById: builder.query<IPlayerData, number>({
      query: (id) => ({
        url: `/getPlayerData/${id}/`,
        method: "GET",
      }),
    }),
  }),
});
