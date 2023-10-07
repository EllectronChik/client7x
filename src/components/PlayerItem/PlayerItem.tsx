import { IPlayer } from 'models/IPlayer';
import React from 'react';
import classes from './PlayerItem.module.scss';

interface PlayerItemProps {
    player: IPlayer;   
}

const PlayerItem: React.FC<PlayerItemProps> = ({player}) => {
  return (
    <div className={classes.player_item}>
      <div>
        {/* TODO: PLAYERS_AVATARS!!! */}
        <img className={classes.avatar} src='http://localhost:8000/media/players/logo/default.svg' alt={player.name} />
      </div>
      <div>
        <h3>Username: {player.name}</h3>
        <p>MMR: {player.mmr}</p>
      </div>
    </div>
  )
}

export default PlayerItem