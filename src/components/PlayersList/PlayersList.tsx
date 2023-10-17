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
import ReloadinWarning from 'components/UI/ReloadinWarning';
import { IResorce } from 'models/IResorce';
import { useCookies } from 'react-cookie';
import { PlayerApi } from 'services/PlayerService';
import { ClanResourcesApi } from 'services/ClanResourcesService';
import { ManagerApi } from 'services/ManagerSerevice';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { setClan, updateClanField, selectClan} from 'store/reducers/ClanSlice';
import { setPlayerList, selectPlayerList } from 'store/reducers/PlayerListSlice';
import { setPageManager } from 'store/reducers/pageManagerSlice';
import important from 'assets/images/important.svg';

interface PlayersListProps {
    tag: string;
}


  
const PlayersList: React.FC<PlayersListProps> = ({tag}) => {
  const dispatch = useAppDispatch();
  const clan = useAppSelector(selectClan);
  const playersSliceList = useAppSelector(selectPlayerList);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cookies, ] = useCookies(['token', 'userId']);
  const [selected, setSelected] = useState<IPlayer[]>([]);
  const [drag, setDrag] = useState<boolean>(false);
  const [clanLogo, setClanLogo] = useState<File | null>(null);
  const [resorces, setResorces] = useState<IResorce[]>([]);
  const [resForms, setResForms] = useState<React.JSX.Element[]>([]);
  const [isClanCreating, setIsClanCreating] = useState<boolean>(false);
  const {data: players, isLoading, error } = ClanApi.useFetchClanMembersQuery(tag);
  const {data: regions} = regionApi.useFetchAllRegionsQuery();
  const [createClan, {error: createClanError, isLoading: createClanLoading}] = ClanApi.usePostClanMutation();
  const [postPlayer, {}] = PlayerApi.usePostPlayerMutation();
  const [postResource, {}] = ClanResourcesApi.usePostClanResourceMutation();
  const [postManager, {}] = ManagerApi.usePostManagerMutation();

  useEffect(() => {
    dispatch(setClan({
      tag: tag,
      name: tag,
      logo: null,
      region: 0,
      user: cookies.userId,
    }));    
  }, [])

  useEffect(() => {
    if (players) dispatch(setPlayerList(
      players.map((player: IPlayer) => ({
        id: player.id,
        username: player.username,
        race: player.race,
        league: player.league,
        region: player.region,
        avatar: '',
        mmr: player.mmr,
        wins: 0,
        total_games: 0,
        realm: player.realm,
        team: player.team,
        user: cookies.userId,
      }))
    ));
    
  }, [players]);


  const handleCreateClan = async () => {    
    if (!clan) {
      return;
    }

    const clanData = {
      tag: clan.tag,
      name: clan.name,
      logo: clanLogo,
      region: clan.region,
      user: cookies.userId,
    }    

    try {
      await createClan({clan: clanData, token: cookies.token});
      setIsClanCreating(true);

      const createdClan = await axios.get(`${import.meta.env.VITE_API_URL}teams/?tag=${clan.tag}`);


      if (selected && createdClan) {
        
        await Promise.all(
          selected.map(async (player) => {
            const playerData = { ...player };
            if (!player) {
              return;
            }
            playerData.avatar = playersSliceList?.find((p) => p.id === player.id)?.avatar || '';
            playerData.team = createdClan.data.results[0].id;          
            
            await postPlayer({ player: playerData, token: cookies.token });


          })
          );
        await Promise.all(
          resorces.map(async (resource) => {
            const resourceData: IResorce = { ...resource };
            if (!resource) {
              return;
            }
            resourceData.team = createdClan.data.results[0].id;
            resourceData.user = cookies.userId;
            await postResource({ resource: resourceData, token: cookies.token });
          })
        ),
        await postManager({manager: {team: createdClan.data.results[0].id, user: cookies.userId}, token: cookies.token});
        dispatch(setPageManager(1));
      }
    } catch (error) {
      setIsClanCreating(false);
    }
  }

  const handleLogoDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleLogoDivDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setClanLogo(e.dataTransfer.files[0]);
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

  const handleAddMediaForm = () => {
    const newId = resForms.length;
    const newMediaForm = <div className={classes.mediaForm} key={newId}>
      <div className={classes.mediaFormBox}>
      <label>Media {resForms.length + 1} url:</label>
        <Input7x type="text" onChange={(e) => {
    const newValue = e.target.value;

    setResorces((resorces) => {
      const updatedResources = [...resorces];
      if (!updatedResources[newId]) {
        updatedResources[newId] = {
          id: newId,
          url: newValue,
        }
      } else {
        updatedResources[newId].url = newValue;
      }
      return updatedResources
    })
  }}/>
      </div>
    </div>
    setResForms([...resForms, newMediaForm]);
  }


  const filteredPlayers = playersSliceList?.filter((player) => {
    return !selected.some((selectedPlayer) => selectedPlayer.id === player.id);
  })

  return (
    <div>
      {!isClanCreating ?
      <div>
        <form className={classes.clanInfo}>
          <h2 className={classes.clanInfoTitle}>Enter clan data:</h2>
          <div className={classes.clanInfoBox}>
            <div className={classes.clanInput}>
              <label htmlFor="tag">Tag:</label>
              <Input7x className={classes.clanTag} id='tag' value={tag} onChange={(e) => dispatch(updateClanField({field: 'tag', value: e.target.value}))} placeholder='Enter clan tag'/>
            </div>
            <div className={classes.clanInput}>
              <label htmlFor="name">Name:</label>
              <Input7x className={classes.clanTag} id='name' value={tag} onChange={(e) => dispatch(updateClanField({field: 'name', value: e.target.value}))} placeholder='Enter clan name'/>
            </div>
          </div>
          <div className={classes.clanInfoBox}>
            <div className={`${classes.clanInputLogo} ${classes.clanInput}`}>
              <label htmlFor="logo">Logo:</label>
              <input ref={fileInputRef} type="file" id="logo" className={classes.logoInput}  onChange={(e) => {
                if (e.target.files) setClanLogo(e.target.files[0])}} />
              <div
                onClick={handleLogoDivClick} 
                onDragLeave={handleLogoDivDragLeave}
                onDragOver={handleLogoDivDragOver} 
                onDrop={handleLogoDivDrop} 
                className={classes.logoDiv}>
                  {!clanLogo ? (drag ? 'Drop logo here' : 'Add logo') : null}
                  {clanLogo && <img src={URL.createObjectURL(clanLogo)} alt="logo" />}
                  </div>
                {createClanError && !clanLogo && <div className={classes.error}><img className={classes.errorIcon} src={important} alt="ERROR: " />This field is required</div>}
            </div>
          </div>
          <div className={classes.clanInfoBox}>
            <div className={`${classes.clanInput} ${classes.clanInputRegion}`}>
            <label>Region:</label>
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
              if (selectedOption) dispatch(updateClanField({field: 'region', value: selectedOption.value}))
              }}/>
              {clan && createClanError && !clan.region && <div className={classes.error}><img className={classes.errorIcon} src={important} alt="ERROR: " />This field is required</div>}
            </div>
          </div>
          <div className={classes.clanInfoBox}>
              <div className={`${classes.clanInput} ${classes.clanInputMedia}`}>
                <label>
                  You can also add links to your clan's media:
                </label>
                <div onClick={handleAddMediaForm} className={classes.AddTeamBox}>
                  Add media
                </div>
                {resForms.map((form) => (
                  form
                ))}
              </div>
          </div>
        </form>
        {/* <ReloadinWarning /> */}
        <div className={classes.selectedList}>
          {selected.length === 0 && <h2>Select only the players who will participate in the leagues </h2>}
          {selected.length > 0 && 
          <div>
            <h2 className={classes.selectedListTitle}>Selected players</h2>
            {selected.map((player) => (
              <PlayerItem title='Click to remove a player' onClick={() => {
                setSelected(selected.filter((selectedPlayer) => selectedPlayer.id !== player.id));
                filteredPlayers?.push(player);
              }} key={player.id} player={player}/>
            ))}
            {!createClanLoading &&
            <div className={classes.selectedListButtons}>
              <Button7x onClick={() => setSelected([])}>Clear selected</Button7x>
              <Button7x className={classes.submitButton} onClick={handleCreateClan}>Submit</Button7x>
            </div>
            }
            </div>}
        </div>
          <div className={classes.techInfo}>
            {(isLoading || createClanLoading) && <Loader7x />}
            {error && 'status' in error && error.status === 'FETCH_ERROR' && <h1> Server do not response </h1>}
            {error && 'status' in error && error.status === 404 && <h1> There is no clan with that tag </h1>}
          </div>
          <div>
            {!createClanLoading && filteredPlayers?.map((player) => (
                <PlayerItem title='Click to add a player' onClick={() => {setSelected([...selected, player])}} key={player.id} player={player} />
            ))}
        </div>
      </div>
      :
      <Loader7x />}
    </div>
  )
}

export default PlayersList