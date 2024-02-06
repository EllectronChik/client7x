import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IManager } from "models/IManager";

export const ManagerApi = createApi({
  reducerPath: "managerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["manager"],
  endpoints: (builder) => ({
    postManager: builder.mutation<void, { manager: IManager; token: string }>({
      query: ({ manager, token }) => ({
        url: `/managers/`,
        method: "POST",
        body: manager,
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});
