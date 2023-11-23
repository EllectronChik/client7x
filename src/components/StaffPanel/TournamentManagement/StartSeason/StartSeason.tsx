import React, { useEffect, useState } from 'react'
import { SeasonApi } from 'services/SeasonService'
import { useCookies } from 'react-cookie';
import important from 'assets/images/techImages/important.svg';
import classes from './StartSeason.module.scss'
import { FormattedMessage } from 'react-intl';
import Input7x from 'components/UI/Input7x/Input7x';
import Button7x from 'components/UI/Button7x/Button7x';
import Loader7x from 'components/UI/Loader7x/Loader7x';

const StartSeason: React.FC = () => {
    const [startSeason, {error: seasonStartError}] = SeasonApi.useStartSeasonMutation();
    const {data: currentSeason, isLoading: currentSeasonLoading} = SeasonApi.useFetchCurrentSeasonQuery();
    const {data: lastSeasonNumber, } = SeasonApi.useFetchLastSeasonNumberQuery();
    const [cookies] = useCookies(['token']);
    const [seasonStarted, setSeasonStarted] = useState<boolean>(false);
    const [seasonStartErrorState, setSeasonStartErrorState] = useState<boolean>(false);

    useEffect(() => {
        if(currentSeason) {
            setSeasonStarted(true);
        }
    }, [currentSeason])
    
  return (
    <div>
        {seasonStarted ? 
        <div>
            SEASON  STARTED
        </div>
        :
        <div>
            {currentSeasonLoading 
            ? 
            <Loader7x />
            :
            <form className={classes.form} onSubmit={(e) => {
                e.preventDefault();
                if (!e.currentTarget.start_time.value) {
                    setSeasonStartErrorState(true);
                    return;
                }
                const isoTime = new Date(e.currentTarget.start_time.value).toISOString();
                startSeason({
                    token: cookies.token,
                    season: {
                        number: lastSeasonNumber ? lastSeasonNumber + 1 : 1,
                        start_datetime: isoTime,
                        is_finished: false,
                        can_register: true
                    }
                });
                setSeasonStarted(true);
            }}>
                <FormattedMessage id='no_seasons' />
                {(seasonStartError || seasonStartErrorState) && <div className={classes.error}><img className={classes.errorIcon} src={important} alt="ERROR: " />
                <FormattedMessage id='required_field' /></div>}
                <div className={classes.form_content}>
                    <label htmlFor='start_time'><FormattedMessage id='start_time' /></label>
                    <Input7x id='start_time' type='datetime-local' />
                </div>
                <div>
                    <Button7x type='submit'><FormattedMessage id='start_season' /></Button7x>
                </div>
            </form>
            }
        </div>
        }
    </div>
  )
}

export default StartSeason