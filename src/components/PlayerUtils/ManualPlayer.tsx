import React from 'react';
import { IPlayer } from 'models/IPlayer';
import axios from 'axios';
import { updatePlayerField } from 'store/reducers/PlayerListSlice';
import classes from './ManualPlayer.module.scss';

export const handleAddPlayerForm = (
    playerForms: React.JSX.Element[],
    setPlayerForms: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>,
    manualPlayers: IPlayer[],
    setManualPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>,
    players: IPlayer[],
    dispatch: React.Dispatch<any>,
    cookies: any
) => {
    let mmr_timeout: NodeJS.Timeout;
    // const dispatch = useAppDispatch();
    // const [cookies, ] = useCookies(['token', 'userId']);


    if (manualPlayers) {
    const newId = playerForms.length;
    setManualPlayers((manualPlayers) => {
      const updatedPlayers = [...manualPlayers];
      if (!updatedPlayers[newId]) {            
        updatedPlayers[newId] = {
          id: newId,
          username: '',
          selected: true,
          race: 0,
          league: 0,
          region: 0,
          avatar: '',
          mmr: 0,
          wins: 0,
          total_games: 0,
          realm: 0,
          team: 0,
          user: cookies.userId,
        }
        
      }
        return updatedPlayers;
      });
    const newPlayerForm = 
    <div className={classes.playerForm} key={newId}>
      <h2>Player {playerForms.length + 1}</h2>
      <div className={classes.playerFormBox}>
      <div className={classes.playerFormBoxElement}>
      <div>
      <label className={classes.playerFormLabel}>Username:</label>
        <input className={classes.playerFormInput} placeholder='Username' type="text" onChange={(e) => {
          const newUsername = e.target.value;        
          setManualPlayers((manualPlayers) => {
            const updatedPlayers = [...manualPlayers];
            updatedPlayers[newId].username = newUsername;
            return updatedPlayers;
            })
        }}/>
        </div>

        <select defaultValue='0' onClick={
          (e) => e.stopPropagation()} 
          onChange={(e) => {
            const newRace = Number(e.target.value);
            setManualPlayers((manualPlayers) => {
              const updatedPlayers = [...manualPlayers];
              updatedPlayers[newId].race = newRace;
              return updatedPlayers;
            })
          }}
          className={classes.select} 
          name="race" id={`race_${newId}`}>
          <option className={classes.option} value="0" disabled>Select Race</option>
          <option className={classes.option} value="1">Zerg</option>
          <option className={classes.option} value="2">Terran</option>
          <option className={classes.option} value="3">Protoss</option>
          <option className={classes.option} value="4">Random</option>
        </select>
        </div>
        <div className={classes.playerFormBoxElement}>
        <div>
        <label className={classes.playerFormLabel}>Mmr:</label>
        <input type="number" className={classes.playerFormInput} placeholder='Mmr' onChange={(e) => {
          const newMmr = parseInt(e.target.value);
          setManualPlayers((manualPlayers) => {
            const updatedPlayers = [...manualPlayers];
            updatedPlayers[newId].mmr = newMmr;
            if (mmr_timeout) {
              clearTimeout(mmr_timeout);
            }
            mmr_timeout = setTimeout(async () => {
              let region;
              switch (updatedPlayers[newId].region) {
                case 1:
                  region = 'US';
                  break;
                case 2:
                  region = 'EU';
                  break;
                case 3:
                  region = 'KR';
                  break;
                default:
                  region = 'EU';
                  break;
              }
              const league = await axios.get(`${import.meta.env.VITE_API_URL}get_league_by_mmr/?mmr=${updatedPlayers[newId].mmr}&region=${region}`);
              if (league.status === 200) {
                if (players) dispatch(updatePlayerField({playerId: updatedPlayers[newId].id + players.length, field: 'league', value: league.data.league}));
                else dispatch(updatePlayerField({playerId: updatedPlayers[newId].id, field: 'league', value: league.data.league}));
              }
            }, 1000);
            return updatedPlayers;
          })
        }}/>
        </div>
        <select className={classes.select}
         defaultValue='0' onClick={
          (e) => e.stopPropagation()}
          onChange={(e) => {
            const newRegion = Number(e.target.value);
            setManualPlayers((manualPlayers) => {
              const updatedPlayers = [...manualPlayers];
              updatedPlayers[newId].region = newRegion;
              return updatedPlayers;
          })}}>
            <option className={classes.option} value="0" disabled>Select Account Region</option>
            <option className={classes.option} value="1">US</option>
            <option className={classes.option} value="2">EU</option>
            <option className={classes.option} value="3">KR</option>
          </select>
          </div>
      </div>
    </div>

    setPlayerForms([...playerForms, newPlayerForm]);
    }
  }