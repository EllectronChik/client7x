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
    postManagerContacts: builder.mutation<
      void,
      { token: string; urls: string[] }
    >({
      query: ({ token, urls }) => ({
        url: `/postManagerContacts/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          urls: urls,
        },
      }),
    }),
    patchManagerContact: builder.mutation<
      void,
      { token: string; id: number; data: string }
    >({
      query: ({ token, id, data }) => ({
        url: `/patchManagerContact/`,
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: {
          id: id,
          data: data,
        },
      }),
    }),
    deleteManagerContact: builder.mutation<void, { token: string; id: number }>(
      {
        query: ({ token, id }) => ({
          url: `/deleteManagerContact/`,
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: {
            id: id,
          },
        }),
      }
    ),
    postManagerContact: builder.mutation<{ id: number }, { token: string }>({
      query: ({ token }) => ({
        url: `/postManagerContact/`,
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});
