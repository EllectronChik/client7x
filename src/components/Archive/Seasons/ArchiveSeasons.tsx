import { ISeason } from "models/ISeason";
import { useEffect, FC } from "react";
import classes from "./ArchiveSeasons.module.scss";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import {
  selectFetching,
  selectNextPage,
  selectPage,
  selectSeasons,
  selectSortDirection,
  setFetching,
  setNextPage,
  setPage,
  setSeasons,
  setSortDirection,
} from "store/reducers/ArchiveSeasonsSlice";
import SortUp from "assets/images/techImages/sortUp.svg";
import SortDown from "assets/images/techImages/sortDown.svg";
import sort from "assets/images/techImages/sort.svg";
import axios from "axios";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

interface ISeasonData extends ISeason {
  winner: string;
}

interface ISeasonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISeasonData[];
}

const ArchiveSeasons: FC = () => {
  const dispatch = useAppDispatch();
  const seasons = useAppSelector(selectSeasons);
  const page = useAppSelector(selectPage);
  const fetching = useAppSelector(selectFetching);
  const sortDirection = useAppSelector(selectSortDirection);

  const nextPage = useAppSelector(selectNextPage);
  const intl = useIntl();

  const scrollHandler = () => {
    if (
      document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) <
        100 &&
      nextPage
    ) {
      dispatch(setFetching(true));
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    document.title = intl.formatMessage({ id: "archive" });

    return () => document.removeEventListener("scroll", scrollHandler);
  }, [nextPage]);

  const handleSortByWinner = () => {
    const newSeasons = [...seasons];
    if (
      newSeasons.length > 1 &&
      (newSeasons[0].winner ? newSeasons[0].winner : "").localeCompare(
        newSeasons[1].winner ? newSeasons[1].winner : ""
      ) > 0
    ) {
      dispatch(setSortDirection(3));
      newSeasons.sort((a, b) =>
        a.winner
          ? a.winner.localeCompare(b.winner ? b.winner : "")
          : "".localeCompare(b.winner ? b.winner : "")
      );
    } else {
      dispatch(setSortDirection(4));
      newSeasons.sort((a, b) =>
        b.winner
          ? b.winner.localeCompare(a.winner ? a.winner : "")
          : "".localeCompare(a.winner ? a.winner : "")
      );
    }

    dispatch(setSeasons(newSeasons));
  };

  const handleSortBySeason = () => {
    const newSeasons = [...seasons];
    if (newSeasons.length > 1 && newSeasons[0].number > newSeasons[1].number) {
      dispatch(setSortDirection(1));
      newSeasons.sort((a, b) => a.number - b.number);
    } else {
      dispatch(setSortDirection(2));
      newSeasons.sort((a, b) => b.number - a.number);
    }
    dispatch(setSeasons(newSeasons));
  };

  useEffect(() => {
    if (fetching) {
      axios
        .get<ISeasonApiResponse>(
          `${import.meta.env.VITE_API_URL}seasons/?_limit=20&page=${page}`
        )
        .then((res) => {
          dispatch(
            setSeasons([
              ...seasons,
              ...res.data.results.filter((s) => s.is_finished === true),
            ])
          );
          dispatch(setPage(page + 1));
          dispatch(setNextPage(res.data.next));
        })
        .finally(() => {
          dispatch(setFetching(false));
        });
    }
  }, [fetching]);

  return (
    <div className={classes.container}>
      <h2>
        <FormattedMessage id="seasons" />
      </h2>
      <div className={classes.table}>
        <div className={classes.header}>
          <div className={classes.col} onClick={() => handleSortBySeason()}>
            <h3>
              <FormattedMessage id="season" />
            </h3>
            <img
              className={classes.sort}
              src={
                sortDirection === 1
                  ? SortUp
                  : sortDirection === 2
                  ? SortDown
                  : sort
              }
              alt=""
            />
          </div>
          <div className={classes.col} onClick={() => handleSortByWinner()}>
            <h3>
              <FormattedMessage id="winner" />
            </h3>
            <img
              className={classes.sort}
              src={
                sortDirection === 3
                  ? SortUp
                  : sortDirection === 4
                  ? SortDown
                  : sort
              }
              alt=""
            />
          </div>
        </div>
        <div className={classes.body}>
          {seasons.map((season) => (
            <Link
              to={`/season/${season.number}`}
              className={classes.row}
              key={season.number}
            >
              <h3 className={classes.col}>
                <FormattedMessage id="season" /> {season.number}
              </h3>
              <h3 className={classes.col}>{season.winner}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchiveSeasons;
