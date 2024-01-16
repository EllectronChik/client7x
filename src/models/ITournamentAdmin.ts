export interface ITournamentAdmin {
    id: number,
    season: number,
    startTime: string,
    isFinished: boolean,
    teamOne: number,
    teamOneName: string,
    teamOneWins: number,
    teamTwo: number,
    teamTwoName: string,
    teamTwoWins: number,
    stage: number,
    group: number,
    winner: number,
    askedTeam: boolean,
    askForFinished: boolean,
    matchesExists?: boolean
}