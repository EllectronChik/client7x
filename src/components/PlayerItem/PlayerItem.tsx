import { IPlayer } from 'models/IPlayer';
import React, { useEffect, useState } from 'react';
import classes from './PlayerItem.module.scss';
import { PlayerLogoApi } from 'services/PlayerLogo';
import defaultPlayer from '../../assets/images/player/default.svg';
import { useAppDispatch } from 'hooks/reduxHooks';
import { updatePlayerField,  } from 'store/reducers/PlayerListSlice';
import us_flag from 'assets/images/region_flags/us.svg';
import eu_flag from 'assets/images/region_flags/eu.svg';
import kr_flag from 'assets/images/region_flags/kr.svg';
import no_league_mark from 'assets/images/league_marks/0.svg';
import bronze_league_mark from 'assets/images/league_marks/1.png';
import silver_league_mark from 'assets/images/league_marks/2.png';
import gold_league_mark from 'assets/images/league_marks/3.png';
import platinum_league_mark from 'assets/images/league_marks/4.png';
import diamond_league_mark from 'assets/images/league_marks/5.png';
import master_league_mark from 'assets/images/league_marks/6.png';
import grandmaster_league_mark from 'assets/images/league_marks/7.png';
import { FormattedMessage } from 'react-intl';


interface PlayerItemProps {
    player: IPlayer;   
    onClick?: (e: React.MouseEvent) => void;
    title?: string;
}

const PlayerItem: React.FC<PlayerItemProps> = ({player, onClick, title}) => {
  const dispatch = useAppDispatch();
  const [playerLeagueLogo, setPlayerLeagueLogo] = useState<string>('');
  const [playerRegionFlag, setPlayerRegionFlag] = useState<typeof us_flag | null>(null);
  const [playerLeagueName, setPlayerLeagueName] = useState<string>('');

  
  useEffect(() => {
    switch (player.league) {
      case 0:
        setPlayerLeagueLogo(no_league_mark);
        break;
      case 1: 
        setPlayerLeagueLogo(bronze_league_mark); 
        setPlayerLeagueName('Bronze');
        break;
      case 2: 
        setPlayerLeagueLogo(silver_league_mark); 
        setPlayerLeagueName('Silver');
        break;
      case 3: 
        setPlayerLeagueLogo(gold_league_mark); 
        setPlayerLeagueName('Gold');
        break;
      case 4: 
        setPlayerLeagueLogo(platinum_league_mark); 
        setPlayerLeagueName('Platinum');
        break;
      case 5: 
        setPlayerLeagueLogo(diamond_league_mark); 
        setPlayerLeagueName('Diamond');
        break;
      case 6: 
        setPlayerLeagueLogo(master_league_mark); 
        setPlayerLeagueName('Master');
        break;
      case 7: 
        setPlayerLeagueLogo(grandmaster_league_mark); 
        setPlayerLeagueName('Grandmaster');
        break;
      default: 
        setPlayerLeagueLogo(no_league_mark); 
        break;
    }

    switch (player.region) {
      case 1:
        setPlayerRegionFlag(us_flag); 
        break;
      case 2:
        setPlayerRegionFlag(eu_flag);
        break;
      case 3:
        setPlayerRegionFlag(kr_flag);
        break;
      default:
        break;
    }
    

  }, [player])

  const {data: playerLogo, error} = PlayerLogoApi.useFetchPlayerLogoQuery({region: player.region, realm: player.realm, id: player.id}); 

  useEffect(() => {
    dispatch(updatePlayerField({
      playerId: player.id,
      field: 'avatar',
      value: playerLogo,
    }))
  }, [playerLogo])


  return (
    <div {...(title && {title})} draggable="false" {...(onClick && {onClick})} className={classes.player_item}>
      <div className={classes.info_wrapper}>
      <div className={classes.avatar_wrapper}>
      {playerRegionFlag && <img className={classes.flag} src={playerRegionFlag} alt={
          (player.region === 1) ? 'US' : (player.region === 2) ? 'EU' : 'KR'
        } />}

      {player.league && <img className={classes.avatar_league} src={playerLeagueLogo} alt={playerLeagueName}/> }
      </div>
          {!error
          ?
          <img className={`${classes.avatar} ${classes.logo}`} src={defaultPlayer} alt={player.username} 
            onLoad={(e) => {
              if (!e.currentTarget.classList.contains('error')) {
                (playerLogo) ? e.currentTarget.src = playerLogo : e.currentTarget.src = defaultPlayer;
              }}}
            onError={(e) => {
              if (!e.currentTarget.classList.contains('error')) {
                e.currentTarget.src = defaultPlayer;
                e.currentTarget.classList.add('error');
          }}} />
        :
        <img className={`${classes.avatar} ${classes.logo}`} src={defaultPlayer} alt={player.username} /> 
      }
      <div>
        <h3>{player.username}</h3>
        <p>MMR: {player.mmr}</p>
      </div>
      </div>
      <div className={classes.select_wrapper} >
        <select 
        onClick={(e) => e.stopPropagation()} 
        value={player.race.toString()}
        onChange={(e) => {
          dispatch(updatePlayerField({playerId: player.id, field: 'race', value: Number(e.target.value)}));
          }}
        className={classes.select} name="race" id={`race_${player.id}`}>
          <option className={classes.option} value="0" disabled><FormattedMessage id="select_race" /></option>
          <option className={classes.option} value="1"><FormattedMessage id="zerg" /></option>
          <option className={classes.option} value="2"><FormattedMessage id="terran" /></option>
          <option className={classes.option} value="3"><FormattedMessage id="protoss" /></option>
          <option className={classes.option} value="4"><FormattedMessage id="random" /></option>
        </select>
      </div>
    </div>
  )
}

export default PlayerItem