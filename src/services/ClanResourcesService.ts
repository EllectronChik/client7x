import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IResorce } from "models/IResorce";

export const ClanResourcesApi = createApi({
  reducerPath: "clanResourcesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["clanResources"],
  endpoints: (builder) => ({
    fetchClanResources: builder.query<IResorce[], number>({
      query: (id) => ({
        url: `/team_resources/${id}/`,
        method: "GET",
      }),
    }),
    postClanResource: builder.mutation<
      void,
      { resource: IResorce; token: string }
    >({
      query: ({ resource, token }) => ({
        url: `/team_resources/`,
        method: "POST",
        body: resource,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});
