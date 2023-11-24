import { ISeason } from 'models/ISeason';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { SeasonApi } from 'services/SeasonService';


const StartedSeasonManage: React.FC = () => {
    const {data: currentSeason, isLoading: currentSeasonLoading} = SeasonApi.useFetchCurrentSeasonQuery();
    const [cookies, setCookies] = useCookies(['token']);
    const [changeTime, {}] = SeasonApi.useChangeDatetimeMutation();
    const [changeIsFinished, {}] = SeasonApi.useChangeIsFinishedMutation();
    const [changeCanRegister, {}] = SeasonApi.useChangeCanRegisterMutation();
    const [localTime, setLocalTime] = useState<string>('');
    let setDateTimeout: NodeJS.Timeout | null = null;
    let setIsFinishedTimeout: NodeJS.Timeout | null = null;
    let setCanRegisterTimeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (currentSeason) {
            setLocalTime(moment.utc(currentSeason.start_datetime).local().format('YYYY-MM-DDTHH:mm'));
        }
    }, [currentSeason])

  return (
    <form>
        <label htmlFor="datetime">Tournament Start Time</label>
        <input type="datetime-local" defaultValue={localTime} onChange={(e) => {
            if (setDateTimeout) {
                clearTimeout(setDateTimeout);
            }
            setDateTimeout = setTimeout(() => {
                changeTime({
                    token: cookies.token,
                    datetime: new Date(e.target.value).toISOString(),
                    season: currentSeason ? currentSeason.number : 0 
            });
        }, 3000)}} />
        <label htmlFor="can_register">Can Register</label>
        <input id="can_register" type="checkbox" defaultChecked={currentSeason?.can_register} onChange={(e) => {
            if (setCanRegisterTimeout) {
                clearTimeout(setCanRegisterTimeout);
            }
            setCanRegisterTimeout = setTimeout(() => {
                changeCanRegister({
                    token: cookies.token,
                    can_register: e.target.checked,
                    season: currentSeason ? currentSeason.number : 0 
                });
        }, 3000)}} />
        <label htmlFor="is_finished">Is Finished</label>
        <input id="is_finished" type="checkbox" defaultChecked={currentSeason?.is_finished} onChange={(e) => {
            if (setIsFinishedTimeout) {
                clearTimeout(setIsFinishedTimeout);
            }
            setIsFinishedTimeout = setTimeout(() => {
                changeIsFinished({
                    token: cookies.token,
                    is_finished: e.target.checked,
                    season: currentSeason ? currentSeason.number : 0 
                });


                // TODO: Add confirmation of tournament completion

        }, 3000)}} />
    </form>
  )
}

export default StartedSeasonManage