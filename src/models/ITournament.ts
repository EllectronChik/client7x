export interface ITournament {
  season?: number;
  match_start_time: string;
  is_finished?: boolean;
  team_one: number;
  team_two: number;
  stage: number;
  group?: number;
}
