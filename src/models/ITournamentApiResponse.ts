import { IClan } from "./IClan";

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
    teamInTournament: number
}