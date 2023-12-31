import React, { useState } from 'react'
import { SeasonApi } from 'services/SeasonService'
import { useCookies } from 'react-cookie';
import important from 'assets/images/techImages/important.svg';
import classes from './StartSeason.module.scss'
import { FormattedMessage } from 'react-intl';
import Button7x from 'components/UI/Button7x/Button7x';

interface StartSeasonProps extends React.HTMLProps<HTMLFormElement> {
    setSeasonStarted: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    timeZoneOffsetString: string;
}

const StartSeason: React.FC<StartSeasonProps> = ({...props}) => {
    const [startSeason, {error: seasonStartError}] = SeasonApi.useStartSeasonMutation();
    const {data: lastSeasonNumber, } = SeasonApi.useFetchLastSeasonNumberQuery();
    const [cookies] = useCookies(['token']);
    const [seasonStartErrorState, setSeasonStartErrorState] = useState<boolean>(false);

    
  return (
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
        
        props.setSeasonStarted(true);
    }}>
        <p className={classes.title}><FormattedMessage id='no_seasons' /></p>
        {(seasonStartError || seasonStartErrorState) && <div className={classes.error}><img className={classes.errorIcon} src={important} alt="ERROR: " />
        <FormattedMessage id='required_field' /></div>}
        <div className={classes.form_content}>
            <label htmlFor='start_time'><FormattedMessage id='start_time' /> (UTC {props.timeZoneOffsetString}) </label>
            <input className={classes.input} id='start_time' type='datetime-local' />
        </div>
        <div>
            <Button7x type='submit'><FormattedMessage id='open_registration' /></Button7x>
        </div>
    </form>
  )
}

export default StartSeason