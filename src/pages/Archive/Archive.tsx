import { FC } from "react";
import classes from "./Archive.module.scss";
import ArchiveSeasons from "components/Archive/Seasons/ArchiveSeasons";
import ArchiveTeams from "components/Archive/Teams/ArchiveTeams";

const Archive: FC = () => {
  return (
    <div className={classes.container}>
      <ArchiveSeasons />
      <ArchiveTeams />
    </div>
  );
};

export default Archive;
