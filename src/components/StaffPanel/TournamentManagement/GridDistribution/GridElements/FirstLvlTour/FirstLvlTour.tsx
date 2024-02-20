import { ChangeEvent, FC } from "react";
import { ILevelsTournaments } from "../../GridModels/ILevelsTournaments";
import { ITeamDict } from "../../GridModels/ITeamDict";
import { FormattedMessage } from "react-intl";
import classes from "./FirstLvlTour.module.scss";

interface IProps {
  row: number;
  col: number;
  lvlsTournaments: ILevelsTournaments;
  teamDict: ITeamDict;
  handleSelectFirstTeam: (
    event: ChangeEvent<HTMLSelectElement>,
    col: number,
    stage: number
  ) => void;
  handleSelectSecondTeam: (
    event: ChangeEvent<HTMLSelectElement>,
    col: number,
    stage: number
  ) => void;
}

const FirstLvlTour: FC<IProps> = ({ row, col, lvlsTournaments, teamDict, handleSelectFirstTeam, handleSelectSecondTeam }) => {
  return (
    <div className={classes.col}>
    {row === 0 && (
      <p className={classes.final}>
        <FormattedMessage id="final" />
      </p>
    )}
    <select
      className={`${classes.select} 
  ${
    lvlsTournaments[1] &&
    lvlsTournaments[1][col] &&
    lvlsTournaments[1][col].teamOne &&
    lvlsTournaments[1][col].winner &&
    lvlsTournaments[1][col].teamOne ==
      lvlsTournaments[1][col].winner
      ? classes.winner
      : ""
  }`}
      value={
        lvlsTournaments[1] && lvlsTournaments[1][col]
          ? lvlsTournaments[1][col].teamOne
          : 0
      }
      onChange={(e) => handleSelectFirstTeam(e, col, 1)}
    >
      <option value="0" disabled>
        <FormattedMessage id="selectTeam" />
      </option>
      {teamDict &&
        Object.values(teamDict).map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
    </select>
    <select
      className={`${classes.select} 
  ${
    lvlsTournaments[1] &&
    lvlsTournaments[1][col] &&
    lvlsTournaments[1][col].teamTwo &&
    lvlsTournaments[1][col].winner &&
    lvlsTournaments[1][col].teamTwo ==
      lvlsTournaments[1][col].winner
      ? classes.winner
      : ""
  }`}
      value={
        lvlsTournaments[1] && lvlsTournaments[1][col]
          ? lvlsTournaments[1][col].teamTwo
          : 0
      }
      onChange={(e) => handleSelectSecondTeam(e, col, 1)}
    >
      <option value="0" disabled>
        <FormattedMessage id="selectTeam" />
      </option>
      {teamDict &&
        Object.values(teamDict).map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
    </select>
  </div>
  )
}

export default FirstLvlTour