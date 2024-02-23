import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IMap } from "models/IMap";
import { IMapsResponse } from "models/IMapsResponse";

export const MapsApi = createApi({
  reducerPath: "mapsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["maps"],

  endpoints: (build) => ({
    fetchMaps: build.query<IMapsResponse, string>({
      query: (token) => ({
        url: `getMapsBySeason/`,
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    postMap: build.mutation<
      IMap,
      { map: string; seasonsNumbers: string; token: string }
    >({
      query: ({ map, seasonsNumbers, token }) => ({
        url: `/maps/`,
        method: "POST",
        body: {
          name: map,
          seasons_numbers: seasonsNumbers,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    addMapToSeason: build.mutation<
      void,
      { seasonsNumber: number; token: string; id: number }
    >({
      query: ({ seasonsNumber, token, id }) => ({
        url: `/maps/${id}/`,
        method: "PATCH",
        body: {
          seasons_numbers: seasonsNumber.toString(),
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
    changeMapName: build.mutation<
      void,
      { name: string; token: string; id: number }
    >({
      query: ({ name, token, id }) => ({
        url: `/maps/${id}/`,
        method: "PATCH",
        body: {
          name: name,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    })
  }),
});
