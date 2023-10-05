import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { ITokenData } from 'models/ITokenData';
import { IUserCreate } from 'models/IUserCreate';
import { IUserLogin } from 'models/IUserLogin';

export const UsersApi = createApi({
    reducerPath: 'UsersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
    }),

    tagTypes: ['users'],
    endpoints: (builder) => ({
        registerUser: builder.mutation<IUserCreate, IUserCreate>({
            query: (user) => ({
                url: '/api/v1/auth/users/',
                method: 'POST',
                body: user,
            })
        }),
        loginUser: builder.mutation<ITokenData, IUserLogin>({
            query: (user) => ({
                url: '/auth/token/login/',
                method: 'POST',
                body: user,
            })
        }),
        logoutUser: builder.mutation<void, string>({
            query: (token) => ({
                url: '/auth/token/logout/',
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`
                }
            })
        }),
    }),
})