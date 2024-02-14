import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UsersApi } from "services/UserService";
import { StatusApi } from "services/StatusService";
import { ClanApi } from "services/ClanService";
import { regionApi } from "services/regionService";
import { PlayerLogoApi } from "services/PlayerLogoService";
import { PlayerApi } from "services/PlayerService";
import { ClanResourcesApi } from "services/ClanResourcesService";
import { DeviceCntApi } from "services/DeviceCntService";
import { SeasonApi } from "services/SeasonService";
import { GroupApi } from "../services/GroupService";
import { TournamentApi } from "services/TournamentService";
import { StatisticsApi } from "services/StatisticsService";
import clanSlice from "store/reducers/ClanSlice";
import playerListSlice from "./reducers/PlayerListSlice";
import pageManagerSlice from "./reducers/pageManagerSlice";
import accountSlice from "./reducers/AccountSlice";
import GroupsSlice from "./reducers/GroupsSlice";
import MatchesSlice from "./reducers/MatchesSlice";
import TournamentsSlice from "./reducers/TournamentsSlice";
import TournamentsAdminSlice from "./reducers/TournamentsAdminSlice";
import StartPageSlice from "./reducers/StartPageSlice";
import ArchiveSeasonsSlice from "./reducers/ArchiveSeasonsSlice";
import ArchiveTeamsSlice from "./reducers/ArchiveTeamsSlice";

const rootReducer = combineReducers({
  [UsersApi.reducerPath]: UsersApi.reducer,
  [StatusApi.reducerPath]: StatusApi.reducer,
  [ClanApi.reducerPath]: ClanApi.reducer,
  [regionApi.reducerPath]: regionApi.reducer,
  [PlayerLogoApi.reducerPath]: PlayerLogoApi.reducer,
  [PlayerApi.reducerPath]: PlayerApi.reducer,
  [ClanResourcesApi.reducerPath]: ClanResourcesApi.reducer,
  [DeviceCntApi.reducerPath]: DeviceCntApi.reducer,
  [SeasonApi.reducerPath]: SeasonApi.reducer,
  [GroupApi.reducerPath]: GroupApi.reducer,
  [TournamentApi.reducerPath]: TournamentApi.reducer,
  [StatisticsApi.reducerPath]: StatisticsApi.reducer,
  clan: clanSlice,
  players: playerListSlice,
  pageManager: pageManagerSlice,
  account: accountSlice,
  groupsManager: GroupsSlice,
  matches: MatchesSlice,
  tournaments: TournamentsSlice,
  tournamentsAdmin: TournamentsAdminSlice,
  startPage: StartPageSlice,
  archiveSeasons: ArchiveSeasonsSlice,
  archiveTeams: ArchiveTeamsSlice,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(UsersApi.middleware)
        .concat(StatusApi.middleware)
        .concat(ClanApi.middleware)
        .concat(regionApi.middleware)
        .concat(PlayerLogoApi.middleware)
        .concat(PlayerApi.middleware)
        .concat(ClanResourcesApi.middleware)
        .concat(DeviceCntApi.middleware)
        .concat(SeasonApi.middleware)
        .concat(GroupApi.middleware)
        .concat(TournamentApi.middleware)
        .concat(StatisticsApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
