import { IPlayer } from "./IPlayer";

export interface IClanByManager {
    team_id: number,
    team_name: string,
    team_logo_url: string,
    players: IPlayer[],
    team_resources?: string[],
    is_reg_to_current_season?: boolean,
}