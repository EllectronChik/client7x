export interface ITournamentAdmin {
  id: number;
  season: number;
  startTime: string;
  isFinished: boolean;
  teamOne: number;
  teamOneName: string;
  teamOneWins: number;
  teamTwo: number;
  teamTwoName: string;
  teamTwoWins: number;
  stage: number;
  group: number | null;
  winner: number | null;
  askedTeam: boolean | null;
  askForFinished: boolean | null;
  matchesExists?: boolean;
  inlineNumber?: number;
}
