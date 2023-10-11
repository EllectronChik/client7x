import React, { useEffect, useState, useRef } from 'react';
import { ClanApi } from 'services/ClanService';
import Loader7x from '../UI/Loader7x/Loader7x';
import PlayerItem from '../PlayerItem/PlayerItem';
import { IPlayer } from 'models/IPlayer';
import classes from './PlayersList.module.scss';
import Button7x from './../UI/Button7x/Button7x';
import Input7x from 'components/UI/Input7x/Input7x';
import { regionApi } from 'services/regionService';
import Select from 'react-select';

interface PlayersListProps {
    tag: string;
}

const PlayersList: React.FC<PlayersListProps> = ({tag}) => {
    const {data: players, isLoading, error } = ClanApi.useFetchClanMembersQuery(tag);
    const {data: regions, isLoading: regionsLoading, error: regionsError} = regionApi.useFetchAllRegionsQuery();
    const [selected, setSelected] = useState<IPlayer[]>([]);
    const [clanTag, setClanTag] = useState<string>(tag);
    const [clanName, setClanName] = useState<string>('');
    const [logo, setLogo] = useState<File | null>(null);
    const [region, setRegion] = useState<number | null>(null);
    const [drag, setDrag] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoDivClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }

    const handleLogoDivDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setLogo(e.dataTransfer.files[0]);
      setDrag(false);
    }

    const handleLogoDivDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDrag(true);
    }

    const handleLogoDivDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDrag(false);
    }

    const regionOptions = regions?.map((region) => ({
      label: region.name,
      value: region.id
    }))

    
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
            <label htmlFor="name">Name:</label>
            <Input7x className={classes.clanTag} id='name' value={tag} onChange={(e) => setClanName(e.target.value)} placeholder='Enter clan name'/>
          </div>
        </div>
        <div className={classes.clanInfoBox}>
          <div className={`${classes.clanInputLogo} ${classes.clanInput}`}>
            <label htmlFor="logo">Logo:</label>
            <input ref={fileInputRef} type="file" id="logo" className={classes.logoInput}  onChange={(e) => setLogo(e.target.files![0])} />
            <div
              onClick={handleLogoDivClick} 
              onDragLeave={handleLogoDivDragLeave}
              onDragOver={handleLogoDivDragOver} 
              onDrop={handleLogoDivDrop} 
              className={classes.logoDiv}>
                {!logo ? (drag ? 'Drop logo here' : 'Add logo') : null}
                {logo && <img src={URL.createObjectURL(logo)} alt="logo" />}
                </div>
          </div>
        </div>
        <div className={classes.clanInfoBox}>
          <div className={`${classes.clanInput} ${classes.clanInputRegion}`}>
          <label htmlFor="region">Region:</label>
          <Select 
            styles={{
              container: (baseStyles, ) => ({
                ...baseStyles,
                width: '100%',
              }),
              control: (baseStyles, ) => ({
                ...baseStyles,
                border: '2px solid #ff0000',
              }),
              option: (baseStyles, ) => ({
                ...baseStyles,
                color: '#1D1D1D',
              }),
              indicatorSeparator: (baseStyles, ) => ({
                ...baseStyles,
                display: 'none',
              }),
              dropdownIndicator: (baseStyles, ) => ({
                ...baseStyles,
                backgroundColor: '#ff0000',
              })
            }}
          options={regionOptions} 
          defaultValue={{label: 'Select region', value: 0}}
          onChange={(selectedOption) => {
            if (selectedOption) setRegion(selectedOption.value)
            }}/>
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
          {error && 'status' in error && error.status === 'FETCH_ERROR' && <h1> Server do not response </h1>}
          {error && 'status' in error && error.status === 404 && <h1> There is no clan with that tag </h1>}
          {filteredPlayers?.map((player) => (
              <PlayerItem title='Click to add a player' onClick={() => {setSelected([...selected, player])}} key={player.id} player={player} />
          ))}
      </div>
    </div>
  )
}

export default PlayersList