import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { MatchesApi } from '../services/MatchesService';
import { UsersApi } from 'services/UserService';
import { StatusApi } from 'services/StatusService';
import { ClanApi } from 'services/ClanService';
import { regionApi } from 'services/regionService';

const rootReducer = combineReducers({
    [MatchesApi.reducerPath]: MatchesApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [StatusApi.reducerPath]: StatusApi.reducer,
    [ClanApi.reducerPath]: ClanApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(MatchesApi.middleware)
        .concat(UsersApi.middleware)
        .concat(StatusApi.middleware)
        .concat(ClanApi.middleware)
        .concat(regionApi.middleware)
    })
        
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']