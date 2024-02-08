import { useEffect, FC } from "react";
import { setFetching, selectNextPage } from "store/reducers/ArchiveSeasonsSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";

import classes from "./Archive.module.scss";
import ArchiveSeasons from "components/Archive/Seasons/ArchiveSeasons";
import { useIntl } from "react-intl";
import ArchiveTeams from "components/Archive/Teams/ArchiveTeams";

const Archive: FC = () => {
  const nextPage = useAppSelector(selectNextPage);
  const dispatch = useAppDispatch();
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

  return (
    <div className={classes.container}>
      <ArchiveSeasons />
      <ArchiveTeams />
    </div>
  );
};

export default Archive;
