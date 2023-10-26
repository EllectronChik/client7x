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
      case 1: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/1.png`); 
        setPlayerLeagueName('Bronze');
        break;
      case 2: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/2.png`); 
        setPlayerLeagueName('Silver');
        break;
      case 3: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/3.png`); 
        setPlayerLeagueName('Gold');
        break;
      case 4: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/4.png`); 
        setPlayerLeagueName('Platinum');
        break;
      case 5: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/5.png`); 
        setPlayerLeagueName('Diamond');
        break;
      case 6: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/6.png`); 
        setPlayerLeagueName('Master');
        break;
      case 7: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/7.png`); 
        setPlayerLeagueName('Grandmaster');
        break;
      default: 
        setPlayerLeagueLogo(`${import.meta.env.VITE_SERVER_URL}media/leagues/0.svg`); 
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

        
      <img className={`${classes.avatar_league}`} src={defaultPlayer} alt={playerLeagueName} 
            onLoad={(e) => {
              if (!e.currentTarget.classList.contains('error')) {
                (playerLeagueLogo) ? e.currentTarget.src = playerLeagueLogo : e.currentTarget.src = defaultPlayer;
              }}}
            onError={(e) => {
              if (!e.currentTarget.classList.contains('error')) {
                e.currentTarget.src = defaultPlayer;
                e.currentTarget.classList.add('error');
          }}} />
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
        defaultValue={player.race.toString()}
        onChange={(e) => {
          dispatch(updatePlayerField({playerId: player.id, field: 'race', value: Number(e.target.value)}));
          console.log(e.target.value);
          }}
        className={classes.select} name="race" id={`race_${player.id}`}>
          <option className={classes.option} value="0" disabled>Select Race</option>
          <option className={classes.option} value="1">Zerg</option>
          <option className={classes.option} value="2">Terran</option>
          <option className={classes.option} value="3">Protoss</option>
          <option className={classes.option} value="4">Random</option>
        </select>
      </div>
    </div>
  )
}

export default PlayerItem