import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IStatus } from "../models/IStatus";


export const StatusApi = createApi({
    reducerPath: "managerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),

    tagTypes: ["managers"],
    endpoints: (builder) => ({
        fetchUserStatus: builder.query<IStatus, string>({
            query: (token) => ({
                url: `/status/`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        })
    })
})
