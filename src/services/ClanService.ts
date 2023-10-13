import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IClan } from "models/IClan";
import { IPlayer } from "models/IPlayer";



export const ClanApi = createApi({
    reducerPath: "clanApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ["clan"],
    endpoints: (builder) => ({
        fetchClanMembers: builder.query<IPlayer[], string>({
            query: (tag) => ({
                url: `/get_players/${tag}/`,
                method: "GET",
            })
        }),
        postClan: builder.mutation<void, {clan: IClan, token: string}>({
            query: ({clan, token}) => {
                const formData = new FormData();
                formData.append("name", clan.name);
                formData.append("tag", clan.tag);
                formData.append("logo", clan.logo);
                formData.append("region", clan.region.toString());
                formData.append("user", clan.user.toString());
                return {
                    url: `/teams/`,
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Token ${token}`
                    }         
                }
            }
        })
    })
})