import { IPlayer } from "./IPlayer";

export interface IClanByManager {
  teamId: number;
  teamName: string;
  teamLogoUrl: string;
  teamTag: string;
  teamRegionName: string;
  teamRegionFlag: string;
  players: IPlayer[];
  teamResources?: {
    id: number;
    teamId: number;
    url: string;
    name: string;
  }[];
  managerResources?: {
    id: number;
    userId: number;
    url: string;
  }[];
  isRegToCurrentSeason?: boolean;
}
