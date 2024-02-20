import { ChangeEvent, FC } from 'react'
import { ILevelsTournaments } from '../../GridModels/ILevelsTournaments';
import { ITeamDict } from '../../GridModels/ITeamDict';
import classes from './ThirdPlaceMatch.module.scss';
import { FormattedMessage } from 'react-intl';

interface IProps {
  gridRow: number;
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

const ThirdPlaceMatch: FC<IProps> = ({
  gridRow,
  lvlsTournaments,
  teamDict,
  handleSelectFirstTeam,
  handleSelectSecondTeam,
}) => {
  return (
    <div
      className={classes.thirdPlace}
      style={{ position: window.innerWidth > 576 ? gridRow >= 4 ? "relative" : "absolute" : "relative" }}
    >
      <p>
        <FormattedMessage id="thirdPlace" />
      </p>
      <select
        className={`${classes.select} ${
          lvlsTournaments[999] &&
          lvlsTournaments[999][0] &&
          lvlsTournaments[999][0].teamOne &&
          lvlsTournaments[999][0].winner &&
          lvlsTournaments[999][0].teamOne == lvlsTournaments[999][0].winner
            ? classes.winner
            : ""
        }`}
        value={
          lvlsTournaments[999] && lvlsTournaments[999][0]
            ? lvlsTournaments[999][0].teamOne
            : 0
        }
        onChange={(e) => handleSelectFirstTeam(e, 0, 999)}
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
        className={`${classes.select} ${
          lvlsTournaments[999] &&
          lvlsTournaments[999][0] &&
          lvlsTournaments[999][0].teamTwo &&
          lvlsTournaments[999][0].winner &&
          lvlsTournaments[999][0].teamTwo == lvlsTournaments[999][0].winner
            ? classes.winner
            : ""
        }`}
        value={
          lvlsTournaments[999] && lvlsTournaments[999][0]
            ? lvlsTournaments[999][0].teamTwo
            : 0
        }
        onChange={(e) => handleSelectSecondTeam(e, 0, 999)}
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
  );
};

export default ThirdPlaceMatch