import { IClan } from "./IClan";
import { IMatch } from "./IMatch";

interface IClanOpponent extends IClan {
    players: {
        id: number,
        username: string
    }[],
} 

export interface ITournamentApiResponse {
    id: number,
    startTime: string,
    timeSuggested: string | null,
    opponent: IClanOpponent,
    isFinished: boolean,
    teamInTournament: number,
    matches?: IMatch[],
    team_one_wins?: number,
    team_two_wins?: number,
    winner?: number,
    askForFinished?: boolean,
    askedTeam?: boolean
}