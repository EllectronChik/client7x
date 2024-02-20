export interface ILevelsTournaments {
  [key: number]: {
    [key: number]: {
      teamOne: number;
      teamTwo: number;
      winner: number;
      id: number | null;
    };
  };
}