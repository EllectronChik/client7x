import { FC } from "react";
import { FormattedMessage } from "react-intl";
import classes from "./SeasonInfo.module.scss";

interface IProps {
  tours: IInfoTours;
  gridRow: number;
}

const SeasonInfo: FC<IProps> = ({ tours, gridRow }) => {
  return (
    <div className={classes.seasonContent}>
      <div className={classes.groups}>
        {tours.groups &&
          Object.keys(tours.groups).map((key) => (
            <div className={classes.group} key={key}>
              <div className={classes.groupName}>
                <h3>
                  <FormattedMessage id="group" />
                </h3>
                <h3>{key}</h3>
              </div>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th className={classes.team}>
                      <h3>
                        <FormattedMessage id="team" />
                      </h3>
                    </th>
                    <th className={classes.wins}>
                      <h3>
                        <FormattedMessage id="wins" />
                      </h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Object.keys(tours.groups[key])).map((key2) => (
                    <tr key={key2}>
                      <th className={classes.team}>
                        <h4>{key2}</h4>
                      </th>
                      <th className={classes.wins}>
                        <h4>{tours.groups[key][key2]}</h4>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
      <div className={classes.gridBox}>
        <h2 className={classes.playOffLabel}>
          <FormattedMessage id="playoff" />:
        </h2>
        <div className={classes.grid}>
          {gridRow === 0 && (
            <h3>
              <FormattedMessage id="gridNotDetermined" />
            </h3>
          )}
          {Array.from(Array(gridRow).keys()).map((row) => (
            <div key={row} className={classes.row}>
              {Array.from(Array(2 ** row).keys()).map((col) => (
                <div
                  key={col}
                  style={{
                    width: `${
                      (200 * 2 ** (gridRow - 1)) / Array(2 ** row).length +
                      20 * (gridRow - row - 1)
                    }px`,
                  }}
                  className={classes.col}
                >
                  {row === 0 && (
                    <h3 className={classes.team}>
                      <FormattedMessage id="final" />
                    </h3>
                  )}
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
                      tours.playoff[gridRow - row - 1][col * 2]?.winner !==
                        null ? (
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
                      tours.playoff[gridRow - row - 1][col * 2 + 1]?.winner !==
                        null ? (
                        <div className={classes.teamBox}>
                          <h3 className={classes.team}>
                            {
                              tours.playoff[gridRow - row - 1][col * 2 + 1]
                                ?.winner
                            }
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
                  {row + 1 !== gridRow && (
                    <div>
                      <div className={classes.line_1}>
                        <div
                          className={classes.col_1}
                          style={{
                            width: `${100 * 2 ** (gridRow - row - 2) + 20}px`,
                          }}
                        ></div>
                        <div
                          className={classes.col_2}
                          style={{
                            width: `${100 * 2 ** (gridRow - row - 2) + 20}px`,
                          }}
                        ></div>
                      </div>
                      <div
                        className={classes.line_2}
                        style={{
                          width: `${200 * 2 ** (gridRow - row - 2) + 40}px`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
              {row === 0 && tours.playoff && tours.playoff[999] && (
                <div className={classes.thirdPlace}>
                  <h3>
                    <FormattedMessage id="thirdPlace" />
                  </h3>
                  <div className={classes.teamBox}>
                    <h3
                      className={`${classes.team} ${
                        tours.playoff[999][0]?.winner ===
                        tours.playoff[999][0]?.teamOne
                          ? classes.winner
                          : ""
                      }`}
                    >
                      {tours.playoff[999][0]?.teamOne}
                    </h3>
                    <h3
                      className={`${classes.score} ${
                        tours.playoff[999][0]?.winner ===
                        tours.playoff[999][0]?.teamOne
                          ? classes.winner
                          : ""
                      }`}
                    >
                      {tours.playoff[999][0]?.teamOneWins}
                    </h3>
                  </div>
                  <div className={classes.teamBox}>
                    <h3
                      className={`${classes.team} ${
                        tours.playoff[999][0]?.winner ===
                        tours.playoff[999][0]?.teamTwo
                          ? classes.winner
                          : ""
                      }`}
                    >
                      {tours.playoff[999][0]?.teamTwo}
                    </h3>
                    <h3
                      className={`${classes.score} ${
                        tours.playoff[999][0]?.winner ===
                        tours.playoff[999][0]?.teamTwo
                          ? classes.winner
                          : ""
                      }`}
                    >
                      {tours.playoff[999][0]?.teamTwoWins}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SeasonInfo;
