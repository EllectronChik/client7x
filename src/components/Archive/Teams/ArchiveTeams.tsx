import { useEffect, FC } from "react";
import classes from "./ArchiveTeams.module.scss";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import {
  selectFetching,
  selectNextPage,
  selectPage,
  selectTeams,
  setFetching,
  setNextPage,
  setPage,
  setTeams,
} from "store/reducers/ArchiveTeamsSlice";
import axios from "axios";
import { useIntl } from "react-intl";
import { IClanData } from "store/reducers/ArchiveTeamsSlice";
import { Link } from "react-router-dom";

interface ITeamsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IClanData[];
}

const ArchiveTeams: FC = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectTeams);
  const page = useAppSelector(selectPage);
  const fetching = useAppSelector(selectFetching);

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

  useEffect(() => {
    if (fetching) {
      axios
        .get<ITeamsApiResponse>(
          `${import.meta.env.VITE_API_URL}teams/?_limit=20&page=${page}`
        )
        .then((res) => {
          dispatch(setTeams([...teams, ...res.data.results]));
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
      <h2>Teams</h2>
      <div className={classes.table}>
        <div className={classes.header}></div>
        <div className={classes.body}>
          {teams.map((team) => (
            <Link to={`/team/${team.id}`} className={classes.row} key={team.id}>
              <img className={classes.logo} src={team.logo} alt={team.name} />
              <div>
                <h3 className={classes.col}>{team.name}</h3>
                <h4 className={classes.col}>&lt;{team.tag}&gt;</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchiveTeams;
