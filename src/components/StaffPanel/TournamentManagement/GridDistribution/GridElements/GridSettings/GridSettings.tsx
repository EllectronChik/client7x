import { Dispatch, FC } from "react";
import { FormattedMessage } from "react-intl";
import classes from "./GridSettings.module.scss";

interface IProps {
  gridRow: number;
  setGridRow: Dispatch<React.SetStateAction<number>>;
  thirdPlace: boolean;
  setThirdPlace: Dispatch<React.SetStateAction<boolean>>;
  maxGridRow: number;
  minGridRow: number;
}

/**
 * GridSettings component
 *
 * This component provides settings for configuring the grid layout, including the number of grid rows
 * and the option to enable or disable the third place indicator.
 *
 * @param gridRow - The number of rows in the grid.
 * @param setGridRow - A function to update the number of grid rows.
 * @param thirdPlace - A boolean indicating whether the third place indicator is enabled or not.
 * @param setThirdPlace - A function to toggle the third place indicator.
 * @param maxGridRow - The maximum allowed number of rows in the grid.
 * @param minGridRow - The minimum allowed number of rows in the grid.
 */
const GridSettings: FC<IProps> = ({
  gridRow,
  setGridRow,
  thirdPlace,
  setThirdPlace,
  maxGridRow,
  minGridRow,
}) => {
  return (
    <div className={classes.gridTitleBox}>
      <div>
        <h3>
          <FormattedMessage id="specifyGrid" />
        </h3>
        <div className={classes.gridTitle}>
          <input
            type="range"
            min={1}
            max={maxGridRow}
            value={gridRow}
            onChange={(e) => {
              if (Number(e.target.value) >= minGridRow) {
                setGridRow(Number(e.target.value));
              }
            }}
          />
          <h3>{gridRow}</h3>
        </div>
      </div>
      <div className={classes.thirdPlace}>
        <label htmlFor="thirdPlace">
          <h3>
            <FormattedMessage id="thirdPlace" />
          </h3>
        </label>
        <input
          id="thirdPlace"
          type="checkbox"
          className={classes.checkbox}
          checked={thirdPlace}
          onChange={() => setThirdPlace(!thirdPlace)}
        />
      </div>
    </div>
  );
};

export default GridSettings;
