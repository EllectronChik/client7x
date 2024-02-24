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

/**
 * FirstLvlTour component
 * 
 * This component represents the first level section of the tour grid.
 * It allows users to select teams for matches in the first stage of the tournament.
 * 
 * @param row - The row index of the tournament grid.
 * @param col - The column index of the tournament grid.
 * @param lvlsTournaments - Object containing tournament data for different levels.
 * @param teamDict - Dictionary object containing team information.
 * @param handleSelectFirstTeam - Function to handle selection of the first team for a match.
 * @param handleSelectSecondTeam - Function to handle selection of the second team for a match.
 */
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