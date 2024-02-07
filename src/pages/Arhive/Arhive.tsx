import axios from "axios";
import { ISeason } from "models/ISeason";
import React, { useEffect, useState } from "react";

import classes from "./Arhive.module.scss";

interface ISeasonData extends ISeason {
  winner: string;
}

interface ISeasonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISeasonData[];
}

const Arhive: React.FC = () => {
  const [seasons, setSeasons] = useState<ISeasonData[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const scrollHandler = () => {
    if (
      document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) <
        100 &&
      nextPage
    ) {
      setFetching(true);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return () => document.removeEventListener("scroll", scrollHandler);
  }, [nextPage]);

  useEffect(() => {
    if (fetching) {
      axios
        .get<ISeasonApiResponse>(
          `${import.meta.env.VITE_API_URL}seasons/?_limit=10&page=${page}`
        )
        .then((res) => {
          setSeasons([...seasons, ...res.data.results]);
          setPage(page + 1);
          setNextPage(res.data.next);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching]);

  const handleSortByWinner = () => {
    const newSeasons = [...seasons];
    newSeasons.sort((a, b) =>
      a.winner
        ? a.winner.localeCompare(b.winner ? b.winner : "")
        : "".localeCompare(b.winner ? b.winner : "")
    );
    setSeasons(newSeasons);
  };

  const handleSortBySeason = () => {
    const newSeasons = [...seasons];
    newSeasons.sort((a, b) => a.number - b.number);
    setSeasons(newSeasons);
  };

  useEffect(() => {
    console.log(seasons);
  }, [seasons]);

  return (
    <div className={classes.container}>
      <h2>Seasons</h2>
      <div className={classes.table}>
        <div className={classes.header}>
          <h3 onClick={() => handleSortBySeason()}>Seasons</h3>
          <h3 onClick={() => handleSortByWinner()}>Winner</h3>
        </div>
        <div className={classes.body}>
          {seasons.map((season) => (
            <div className={classes.row} key={season.number}>
              <h3 className={classes.col}>Season {season.number}</h3>
              <h3 className={classes.col}>{season.winner}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Arhive;
