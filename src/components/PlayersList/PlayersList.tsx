import React, { useEffect, useState } from 'react';
import { ClanApi } from 'services/ClanService';
import Loader7x from '../UI/Loader7x/Loader7x';
import PlayerItem from '../PlayerItem/PlayerItem';
import { IPlayer } from 'models/IPlayer';
import classes from './PlayersList.module.scss';
import Button7x from './../UI/Button7x/Button7x';
import Input7x from 'components/UI/Input7x/Input7x';

interface PlayersListProps {
    tag: string;
}

const PlayersList: React.FC<PlayersListProps> = ({tag}) => {
    const {data: players, isLoading, error } = ClanApi.useFetchClanMembersQuery(tag);
    const [selected, setSelected] = useState<IPlayer[]>([]);
    const [clanTag, setClanTag] = useState<string>(tag);
    useEffect(() => {
      console.log(selected);
    }, [selected])
    const filteredPlayers = players?.filter((player) => {
      return !selected.some((selectedPlayer) => selectedPlayer.id === player.id);
    })
  return (
    <div>
      <form className={classes.clanInfo}>
        <h2 className={classes.clanInfoTitle}>Enter clan data:</h2>
        <div className={classes.clanInfoBox}>
          <div className={classes.clanInput}>
            <label htmlFor="tag">Tag:</label>
            <Input7x className={classes.clanTag} id='tag' value={tag} onChange={(e) => setClanTag(e.target.value)} placeholder='Enter clan tag'/>
          </div>
          <div className={classes.clanInput}>
            <label htmlFor="tag">Name:</label>
            <Input7x className={classes.clanTag} id='tag' value={tag} onChange={(e) => setClanTag(e.target.value)} placeholder='Enter clan tag'/>
          </div>

        </div>
      </form>
      <div className={classes.selectedList}>
        {selected.length === 0 && <h2>Select only the players who will participate in the leagues </h2>}
        {selected.length > 0 && 
        <div>
          <h2 className={classes.selectedListTitle}>Selected players</h2>
          {selected.map((player) => (
            <PlayerItem title='Click to remove a player' onClick={() => {
              setSelected(selected.filter((selectedPlayer) => selectedPlayer.id !== player.id));
              players?.push(player);
            }} key={player.id} player={player}/>
          ))}
          <div className={classes.selectedListButtons}>
            <Button7x onClick={() => setSelected([])}>Clear selected</Button7x>
            <Button7x className={classes.submitButton} >Submit</Button7x>

          </div>
          </div>}
      </div>
        <div>
          {isLoading && <Loader7x />}
          {error && <h1>There is no clan with that tag</h1>}
          {filteredPlayers?.map((player) => (
              <PlayerItem title='Click to add a player' onClick={() => {setSelected([...selected, player])}} key={player.id} player={player} />
          ))}
      </div>
    </div>
  )
}

export default PlayersList