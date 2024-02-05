import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const playerLogoApiUrl = import.meta.env.VITE_API_URL;

const controller = new AbortController();
const { signal } = controller;

export const PlayerLogoApi = createApi({
    reducerPath: "playerLogoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: playerLogoApiUrl,
    }),
    tagTypes: ["playerLogo"],
    endpoints: (builder) => ({
        fetchPlayerLogo: builder.query<string, { region: number, realm: number, id: number }>({
            query: ({ region, realm, id }) => ({
                url: `/get_player_logo/${region}/${realm}/${id}/`,
                method: "GET",
                signal
            })
        })
    })
});

export const cancelAllLogoRequests = () => controller.abort();
