import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { MatchesApi } from '../services/MatchesService';
import { UsersApi } from 'services/UserService';
import { StatusApi } from 'services/StatusService';

const rootReducer = combineReducers({
    [MatchesApi.reducerPath]: MatchesApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [StatusApi.reducerPath]: StatusApi.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(MatchesApi.middleware)
        .concat(UsersApi.middleware)
        .concat(StatusApi.middleware),

    })
        
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']