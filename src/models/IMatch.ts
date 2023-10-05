export interface IMatch {
    id: number;
    season: number;
    stage: number;
    match_start_time: Date;
    player_1_id: number;
    player_2_id: number;
    is_finished: boolean;
}