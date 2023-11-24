import Loader7x from 'components/UI/Loader7x/Loader7x';
import React, { useEffect, useState } from 'react';
import StartSeason from './StartSeason/StartSeason';
import { SeasonApi } from 'services/SeasonService';
import StartedSeasonManage from './StartedSeasonManage/StartedSeasonManage';

const TourManage: React.FC = () => {
  const {data: currentSeason, isLoading: currentSeasonLoading} = SeasonApi.useFetchCurrentSeasonQuery();
  const [seasonStarted, setSeasonStarted] = useState<boolean>(false);


  useEffect(() => {
    if(currentSeason) {
        setSeasonStarted(true);
    }
}, [currentSeason])

  return (
    <div>
      {currentSeasonLoading ?
       <Loader7x />
      : (!seasonStarted && !currentSeason) ? <div>
        <StartSeason setSeasonStarted={setSeasonStarted} /> 
      </div>
      : <StartedSeasonManage />
      }
    </div>
  )
}

export default TourManage;