import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const PlayerLogoApi = createApi({
    reducerPath: "playerLogoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ["playerLogo"],
    endpoints: (builder) => ({
        fetchPlayerLogo: builder.query<string, { region: number, realm: number, id: number }>({
            query: ({region, realm, id}) => ({
                url: `/get_player_logo/${region}/${realm}/${id}/`,
                method: "GET",
            })
        })
    })
})