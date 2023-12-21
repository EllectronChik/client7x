import { IClan } from "./IClan";

export interface ITournamentApiResponse {
    id: number,
    startTime: string,
    timeSuggested: string | null,
    opponent: IClan,
    isFinished: boolean
}