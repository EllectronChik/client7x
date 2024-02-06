import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IRegion } from "models/IRegion";

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["regions"],
  endpoints: (builder) => ({
    fetchAllRegions: builder.query<IRegion[], void>({
      query: () => ({
        url: `/regions/`,
        method: "GET",
      }),
    }),
  }),
});
