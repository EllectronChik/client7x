import { FC } from "react";
import classes from "./StageInfo.module.scss";
import { IInfoTours } from "models/IInfoTours";

interface IProps {
  tours: IInfoTours;
  gridRow: number;
  row: number;
  col: number;
}

const StageInfo: FC<IProps> = ({ tours, gridRow, row, col }) => {
  return (
    <div>
      {tours.playoff &&
        tours.playoff[gridRow - row] &&
        tours.playoff[gridRow - row][col] && (
          <div className={classes.teamBox}>
            <h3
              className={`${classes.team} ${
                tours.playoff[gridRow - row][col].winner ===
                tours.playoff[gridRow - row][col].teamOne
                  ? classes.winner
                  : ""
              }`}
            >
              {tours.playoff[gridRow - row][col].teamOne}
            </h3>
            <h3
              className={`${classes.score} ${
                tours.playoff[gridRow - row][col].winner ===
                tours.playoff[gridRow - row][col].teamOne
                  ? classes.winner
                  : ""
              }`}
            >
              {tours.playoff[gridRow - row][col].teamOneWins}
            </h3>
          </div>
        )}
      {tours.playoff &&
        tours.playoff[gridRow - row] &&
        tours.playoff[gridRow - row][col] && (
          <div className={classes.teamBox}>
            <h3
              className={`${classes.team} ${
                tours.playoff[gridRow - row][col].winner ===
                tours.playoff[gridRow - row][col].teamTwo
                  ? classes.winner
                  : ""
              }`}
            >
              {tours.playoff[gridRow - row][col].teamTwo}
            </h3>
            <h3
              className={`${classes.score} ${
                tours.playoff[gridRow - row][col].winner ===
                tours.playoff[gridRow - row][col].teamTwo
                  ? classes.winner
                  : ""
              }`}
            >
              {tours.playoff[gridRow - row][col].teamTwoWins}
            </h3>
          </div>
        )}
      {(!tours.playoff[gridRow - row] ||
        !tours.playoff[gridRow - row][col]) && (
        <div>
          {tours.playoff[gridRow - row - 1] &&
          tours.playoff[gridRow - row - 1][col * 2] &&
          tours.playoff[gridRow - row - 1][col * 2]?.winner !== null ? (
            <div className={classes.teamBox}>
              <h3 className={classes.team}>
                {tours.playoff[gridRow - row - 1][col * 2]?.winner}
              </h3>
              <h3 className={classes.score}>0</h3>
            </div>
          ) : (
            <div className={classes.teamBox}>
              <h3 className={classes.team}></h3>
              <h3 className={classes.score}>0</h3>
            </div>
          )}
          {tours.playoff[gridRow - row - 1] &&
          tours.playoff[gridRow - row - 1][col * 2 + 1] &&
          tours.playoff[gridRow - row - 1][col * 2 + 1]?.winner !== null ? (
            <div className={classes.teamBox}>
              <h3 className={classes.team}>
                {tours.playoff[gridRow - row - 1][col * 2 + 1]?.winner}
              </h3>
              <h3 className={classes.score}>0</h3>
            </div>
          ) : (
            <div className={classes.teamBox}>
              <h3 className={classes.team}></h3>
              <h3 className={classes.score}>0</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StageInfo;
