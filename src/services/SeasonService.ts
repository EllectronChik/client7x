import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { ISeason } from "../models/ISeason";

export const SeasonApi = createApi({
  reducerPath: "SeasonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    fetchAllSeasons: builder.query<void, void>({
      query: () => ({
        url: `/seasons/`,
        method: "GET",
      }),
    }),
    fetchCurrentSeason: builder.query<ISeason, void>({
      query: () => ({
        url: `/get_current_season/`,
        method: "GET",
      }),
    }),
    fetchLastSeasonNumber: builder.query<number, void>({
      query: () => ({
        url: `/get_last_season_number/`,
        method: "GET",
      }),
    }),
    startSeason: builder.mutation<void, { token: string; season: ISeason }>({
      query: ({ token, season }) => ({
        url: `/seasons/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          number: season.number,
          start_datetime: season.start_datetime,
          is_finished: season.is_finished,
          can_register: season.can_register,
        },
      }),
    }),
    changeDatetime: builder.mutation<
      void,
      { token: string; datetime: string; season: number }
    >({
      query: ({ token, datetime, season }) => ({
        url: `/seasons/${season}/`,
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          start_datetime: datetime,
        },
      }),
    }),
    changeCanRegister: builder.mutation<
      void,
      { token: string; can_register: boolean; season: number }
    >({
      query: ({ token, can_register, season }) => ({
        url: `/seasons/${season}/`,
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          can_register: can_register,
        },
      }),
    }),
    changeIsFinished: builder.mutation<
      void,
      { token: string; is_finished: boolean; season: number }
    >({
      query: ({ token, is_finished, season }) => {
        const body: { is_finished: boolean; can_register?: boolean } = {
          is_finished: is_finished,
        };
        if (is_finished) {
          body.can_register = false;
        }
        return {
          url: `/seasons/${season}/`,
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: body,
        };
      },
    }),
  }),
});
