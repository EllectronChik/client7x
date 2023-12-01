import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { ClanApi } from 'services/ClanService';
import teamDefault from '../../../assets/images/team/teamDefault.png';
import classes from './ClanInfo.module.scss';
import zerg from '../../../assets/images/races/zerg.svg';
import terran from '../../../assets/images/races/terran.svg';
import protoss from '../../../assets/images/races/protoss.svg';
import random from '../../../assets/images/races/random.svg';
import bronze from '../../../assets/images/league_marks/1.png';
import silver from '../../../assets/images/league_marks/2.png';
import gold from '../../../assets/images/league_marks/3.png';
import platinum from '../../../assets/images/league_marks/4.png';
import diamond from '../../../assets/images/league_marks/5.png';
import master from '../../../assets/images/league_marks/6.png';
import grandmaster from '../../../assets/images/league_marks/7.png';
import leagueDefault from '../../../assets/images/league_marks/0.svg';
import playerDefault from '../../../assets/images/player/default.svg';
import edit from '../../../assets/images/techImages/edit.svg';
import { FormattedMessage } from 'react-intl';


const ClanInfo: React.FC = () => {
    const [cookies,] = useCookies(['userId']);
    const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
    const [race, setRace] = useState< JSX.Element[]>([]);
    const [leagues, setLeagues] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (myTeam) {
            setRace(() => {
                return myTeam.players.map((player) => {
                    console.log(player);
                    
                    if (player.race === 1) {
                        return <img key={player.id} draggable={false} src={zerg} alt='zerg' className={classes.race} />;
                    } else if (player.race === 2) {
                        return <img key={player.id} draggable={false} src={terran} alt='terran' className={classes.race} />;
                    } else if (player.race === 3) {
                        return <img key={player.id} draggable={false} src={protoss} alt='protoss' className={classes.race} />;
                    } else if (player.race === 4) {
                        return <img key={player.id} draggable={false} src={random} alt='random' className={classes.race} />;
                    } else {
                        return <img key={player.id} draggable={false} src={teamDefault} alt='default' className={classes.race} />;
                    }
                });
            });
            setLeagues(() => {
                return myTeam.players.map((player) => {
                    if (player.league === 1) {
                        return <img key={player.id} draggable={false} src={bronze} alt='bronze' className={classes.league} />;
                    } else if (player.league === 2) {
                        return <img key={player.id} draggable={false} src={silver} alt='silver' className={classes.league} />;
                    } else if (player.league === 3) {
                        return <img key={player.id} draggable={false} src={gold} alt='gold' className={classes.league} />;
                    } else if (player.league === 4) {
                        return <img key={player.id} draggable={false} src={platinum} alt='platinum' className={classes.league} />;
                    } else if (player.league === 5) {
                        return <img key={player.id} draggable={false} src={diamond} alt='diamond' className={classes.league} />;
                    } else if (player.league === 6) {
                        return <img key={player.id} draggable={false} src={master} alt='master' className={classes.league} />;
                    } else if (player.league === 7) {
                        return <img key={player.id} draggable={false} src={grandmaster} alt='grandmaster' className={classes.league} />;
                    } else {
                        return <img key={player.id} draggable={false} src={leagueDefault} alt='default' className={classes.league} />;
                    }
                });
            })
        }
        console.log(myTeam?.team_id);
        
    }, [myTeam]);
    


  return (
    <div className={classes.teamManage}>
        {myTeam && 
        <div className={classes.teamInfo}>
            <img src={teamDefault} alt={myTeam.team_name} 
            className={classes.teamLogo}
            onLoad={(e) => {
                e.currentTarget.src = `${import.meta.env.VITE_SERVER_URL}${myTeam.team_logo_url}`
            }}/>
            <h2 className={classes.teamName}>{myTeam.team_name}</h2>
            <div>
                <img className={classes.edit} src={edit} alt="" />
            </div>
        </div>}
        <div className={classes.teamContent}>
            <div className={classes.playersInfo}>
                {myTeam && myTeam.players.map((player, index) => (
                    <div className={classes.playerInfo} key={index}>
                        <div className={classes.playerInfoBox}>
                            <div className={classes.infoImages}>
                                <div>{leagues[index]}</div>
                                <div>{race[index]}</div>
                            </div>
                            <img src={playerDefault} alt={player.username} 
                            className={classes.playerLogo}
                            onLoad={(e) => {
                                if (!e.currentTarget.classList.contains('error')) {
                                    (player.avatar) ? e.currentTarget.src = player.avatar : e.currentTarget.src = playerDefault;
                                }
                            }}
                            onError={(e) => {
                                if (!e.currentTarget.classList.contains('error')) {
                                    e.currentTarget.classList.add('error');
                                    e.currentTarget.src = playerDefault;
                                }
                            }}/>
                            <div>
                                <h2 className={classes.playerName}>{player.username}</h2>
                                <h3 className={classes.playerMMR}>MMR: {player.mmr}</h3>
                            </div>
                        </div>
                        <div className={classes.playerStats}>
                            <div className={classes.playerStat}>
                                <h4><FormattedMessage id='totalGames' />: </h4>
                                <h4 className={classes.playerWins}>{player.total_games}</h4>
                            </div>
                            <div className={classes.playerStat}>
                                <h4><FormattedMessage id='wins' />: </h4>
                                <h4 className={classes.playerWins}>{player.wins}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ClanInfo