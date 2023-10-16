import { IPlayer } from 'models/IPlayer';
import React, { useEffect, useState } from 'react';
import classes from './PlayerItem.module.scss';
import { PlayerLogoApi } from 'services/PlayerLogo';
import defaultPlayer from '../../assets/images/player/default.svg';

interface PlayerItemProps {
    player: IPlayer;   
    onClick?: (e: React.MouseEvent) => void;
    title?: string;
}

const PlayerItem: React.FC<PlayerItemProps> = ({player, onClick, title}) => {
  const [playerLeagueLogo, setPlayerLeagueLogo] = useState<string>('');
  const [playerLeagueName, setPlayerLeagueName] = useState<string>('');
  const [playerRace, setPlayerRace] = useState<number>(0);
  
  const {data: playerLogo, error} = PlayerLogoApi.useFetchPlayerLogoQuery({region: player.region, realm: player.realm, id: player.id}); 

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

    switch (player.race) {
      case 1:
        setPlayerRace(1);
        break;
      case 2:
        setPlayerRace(2);
        break;
      case 3:
        setPlayerRace(3);
        break;
      case 4:
        setPlayerRace(4);
        break;
      default:
        setPlayerRace(0);
    }
  }, [player])


  return (
    <div {...(title && {title})} draggable="false" {...(onClick && {onClick})} className={classes.player_item}>
      <div className={classes.info_wrapper}>
      <div>
        <img className={classes.avatar} src={defaultPlayer} onLoad={(e) => e.currentTarget.src = playerLeagueLogo} alt={playerLeagueName} />
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
      </div>
      <div>
        <h3>Username: {player.username}</h3>
        <p>MMR: {player.mmr}</p>
      </div>
      </div>
      <div className={classes.select_wrapper} >
        <select onClick={(e) => e.stopPropagation()} defaultValue={player.race.toString()} className={classes.select} name="race" id={`race_${player.id}`}>
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