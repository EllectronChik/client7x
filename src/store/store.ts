import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { MatchesApi } from '../services/MatchesService';
import { UsersApi } from 'services/UserService';
import { StatusApi } from 'services/StatusService';
import { ClanApi } from 'services/ClanService';
import { regionApi } from 'services/regionService';
import { PlayerLogoApi } from 'services/PlayerLogo';
import { PlayerApi } from 'services/PlayerService';
import { ClanResourcesApi } from 'services/ClanResourcesService';
import { DeviceCntApi } from 'services/DeviceCntService';
import clanSlice from 'store/reducers/ClanSlice';
import playerListSlice from './reducers/PlayerListSlice';
import pageManagerSlice from './reducers/pageManagerSlice';

const rootReducer = combineReducers({
    [MatchesApi.reducerPath]: MatchesApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [StatusApi.reducerPath]: StatusApi.reducer,
    [ClanApi.reducerPath]: ClanApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [PlayerLogoApi.reducerPath]: PlayerLogoApi.reducer,
    [PlayerApi.reducerPath]: PlayerApi.reducer,
    [ClanResourcesApi.reducerPath]: ClanResourcesApi.reducer,
    [DeviceCntApi.reducerPath]: DeviceCntApi.reducer,
    clan: clanSlice,
    players: playerListSlice,
    pageManager: pageManagerSlice,
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
        .concat(PlayerLogoApi.middleware)
        .concat(PlayerApi.middleware)
        .concat(ClanResourcesApi.middleware)
        .concat(DeviceCntApi.middleware)
    })
        
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']