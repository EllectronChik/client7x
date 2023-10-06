import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IManager } from "../models/IManager";


export const ManagerApi = createApi({
    reducerPath: "managerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),

    tagTypes: ["managers"],
    endpoints: (builder) => ({
        fetchUserManager: builder.query<IManager, number>({
            query: (id) => ({
                url: `/managers/${id}/`,
                method: "GET",
            })
        })
    })
})
