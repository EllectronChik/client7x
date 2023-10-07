import React from 'react';
import { ClanApi } from 'services/ClanService';
import Loader7x from './UI/Loader7x/Loader7x';
import PlayerItem from './PlayerItem/PlayerItem';

interface PlayersListProps {
    tag: string;
}

const PlayersList: React.FC<PlayersListProps> = ({tag}) => {
    const {data: players, isLoading, error } = ClanApi.useFetchClanMembersQuery(tag);
    console.log(players);
  return (
    <div>
        {isLoading && <Loader7x />}
        {error && <h1>There is no clan with that tag</h1>}
        {players?.map((player) => (
            <PlayerItem key={player.id} player={player} />
        ))}
    </div>
  )
}

export default PlayersList