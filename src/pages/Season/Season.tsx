import { FC, useEffect } from "react";
import { useParams } from "react-router";
import classes from "./Season.module.scss";
import SeasonInfo from "components/SeasonInfo/SeasonInfo";
import { SeasonApi } from "services/SeasonService";
import { FormattedMessage, useIntl } from "react-intl";

const Season: FC = () => {
  const params = useParams();
  const intl = useIntl();
  const { data: seasonData } = SeasonApi.useFetchSeasonDataQuery(
    parseInt(params.season ? params.season : "1")
  );

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: "season" })} ${params.season}`;
  }, [params.season]);

  return (
    <div className={classes.container}>
      <h2>
        <FormattedMessage id="season" /> {params.season}
      </h2>
      {seasonData && (
        <SeasonInfo
          tours={seasonData}
          gridRow={
            seasonData.playoff[1]
              ? Math.ceil(
                  Math.log2(
                    Math.max(
                      ...Object.keys(seasonData.playoff[1]).map((key) =>
                        parseInt(key)
                      )
                    ) + 1
                  ) + 1
                )
              : 0
          }
        />
      )}
    </div>
  );
};

export default Season;
