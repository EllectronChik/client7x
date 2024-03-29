import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IClan } from "models/IClan";
import { IClanByManager } from "models/IClanByManager";
import { IPlayer } from "models/IPlayer";
import { IClanData } from "../store/reducers/ArchiveTeamsSlice";
import { IResorce } from "models/IResorce";

interface IRegistrationData {
  token: string;
  season: number;
  user: number;
  team: number;
}

interface IManagerContacts {
  id: number;
  url: string;
  user: number;
}

interface IFetchedClanData {
  team: IClanData;
  teamRegion: {
    url: string;
    name: string;
  };
  teamResources: IResorce[];
  manager: string;
  managerContacts: IManagerContacts[];
  players: IPlayer[];
  tournaments: {
    id: number;
    season: number;
    matchStartTime: string;
    wins: number;
    opponent: string;
    opponentWins: number;
  }[];
}

export const ClanApi = createApi({
  reducerPath: "clanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["clan"],
  endpoints: (builder) => ({
    fetchClanMembers: builder.query<IPlayer[], string>({
      query: (tag) => ({
        url: `/get_players/${tag}/`,
        method: "GET",
      }),
    }),
    fetchClan: builder.query<IClan, string>({
      query: (tag) => ({
        url: `/teams/?tag=${tag}`,
        method: "GET",
      }),
    }),
    fetchClanByManager: builder.query<IClanByManager, string>({
      query: (id) => ({
        url: `/manager/team/?user=${id}`,
        method: "GET",
      }),
    }),
    postClan: builder.mutation<void, { clan: IClan; token: string }>({
      query: ({ clan, token }) => {
        const formData = new FormData();
        formData.append("name", clan.name);
        formData.append("tag", clan.tag);
        if (clan.logo) formData.append("logo", clan.logo);
        formData.append("region", clan.region.toString());
        formData.append("user", clan.user.toString());
        return {
          url: `/teams/`,
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        };
      },
    }),
    participateInSeason: builder.mutation<void, IRegistrationData>({
      query: ({ token, season, user, team }) => ({
        url: "/tournament_registration/",
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          season: season,
          user: user,
          team: team,
        },
      }),
    }),
    changeLogo: builder.mutation<
      void,
      { teamId: number; logo: File; token: string }
    >({
      query: ({ teamId, logo, token }) => {
        const formData = new FormData();
        formData.append("logo", logo);
        return {
          url: `/teams/${teamId}/`,
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        };
      },
    }),
    changeName: builder.mutation<
      void,
      { teamId: number; name: string; token: string }
    >({
      query: ({ teamId, name, token }) => ({
        url: `/teams/${teamId}/`,
        method: "PATCH",
        body: {
          name: name,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    changeTag: builder.mutation<
      void,
      { teamId: number; tag: string; token: string }
    >({
      query: ({ teamId, tag, token }) => ({
        url: `/teams/${teamId}/`,
        method: "PATCH",
        body: {
          tag: tag,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    fetchClanData: builder.query<IFetchedClanData, number>({
      query: (id) => ({
        url: `/getTeamData/${id}/`,
        method: "GET",
      }),
    }),
    patchClanResUrl: builder.mutation<
      void,
      { token: string; id: number; data: string }
    >({
      query: ({ token, id, data }) => ({
        url: `/patchTeamResourceUrl/`,
        method: "PATCH",
        body: {
          id: id,
          data: data,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    patchClanResName: builder.mutation<
      void,
      { token: string; id: number; data: string }
    >({
      query: ({ token, id, data }) => ({
        url: `/patchTeamResourceName/`,
        method: "PATCH",
        body: {
          id: id,
          data: data,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    deleteClanRes: builder.mutation<void, { token: string; id: number }>({
      query: ({ token, id }) => ({
        url: `/deleteTeamResource/`,
        method: "DELETE",
        body: {
          id: id,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    postClanRes: builder.mutation<
      { id: number; teamId: number },
      { token: string }
    >({
      query: ({ token }) => ({
        url: `/postTeamResource/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});
