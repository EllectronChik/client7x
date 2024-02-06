interface IInfoTours {
  groups: {
    [key: string]: {
      [key: string]: number;
    };
  };
  playoff: {
    [key: number]: {
      [key: number]: {
        teamOne: string;
        teamTwo: string;
        teamOneWins: number;
        teamTwoWins: number;
        winner: string | null;
      };
    };
  };
}
