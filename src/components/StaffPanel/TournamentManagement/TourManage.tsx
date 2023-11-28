import Loader7x from 'components/UI/Loader7x/Loader7x';
import React, { useEffect, useState } from 'react';
import StartSeason from './StartSeason/StartSeason';
import { SeasonApi } from 'services/SeasonService';
import StartedSeasonManage from './StartedSeasonManage/StartedSeasonManage';


const TourManage: React.FC = () => {
  const {data: currentSeason, isLoading: currentSeasonLoading} = SeasonApi.useFetchCurrentSeasonQuery();
  const [seasonStarted, setSeasonStarted] = useState<boolean | undefined>(undefined);
  const [timeZoneOffset, ] = useState<number>(- new Date().getTimezoneOffset() / 60);
  const [timeZoneOffsetString, setTimeZoneOffsetString] = useState<string>(String(timeZoneOffset));

  useEffect(() => {
      if (timeZoneOffset < 0) {
          setTimeZoneOffsetString(`- ${timeZoneOffset}`);
      } else {
          setTimeZoneOffsetString(`+ ${timeZoneOffset}`);
      }
  }, [timeZoneOffset])


  useEffect(() => {
    if (!currentSeasonLoading) {
      if(currentSeason) {
          setSeasonStarted(true);
      } else {
          setSeasonStarted(false);
      }
    }
}, [currentSeason])

  return (
    <div>
      {currentSeasonLoading ?
       <Loader7x />
      : (seasonStarted === false) ? <div>
        <StartSeason setSeasonStarted={setSeasonStarted} timeZoneOffsetString={timeZoneOffsetString} /> 
      </div>
      : <StartedSeasonManage setSeasonStarted={setSeasonStarted} timeZoneOffsetString={timeZoneOffsetString} />
      }
    </div>
  )
}

export default TourManage;