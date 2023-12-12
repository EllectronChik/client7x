import { IClan } from "./IClan";

export interface IGroup {
    id?: number,
    groupMark: string,
    teams: IClan[],
}