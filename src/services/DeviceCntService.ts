import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const DeviceCntApi = createApi({
    reducerPath: 'DeviceCntApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        fetchDeviceCnt: builder.query<number, string>({
            query: (token) => ({
                url: `/users_devices/`,
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            }),
        }),
        patchDeviceCnt: builder.mutation<void, {token: string, action: string}>({
            query: ({token, action}) => ({
                url: `/users_devices/`,
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`
                },
                body: {
                    action: action
                }
            }),
        })
    })
})