import React, { useEffect, useState } from 'react';
import classes from './MatchDistribution.module.scss';
import { selectGroups } from 'store/reducers/GroupsSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import Button7x from 'components/UI/Button7x/Button7x';
import {    setInputValues, 
            setSelectedTeams, 
            selectSelectedTeams, 
            selectInputValues, 
            setUnselectedTeams, 
            selectUnselectedTeams } from 'store/reducers/MatchesSlice';
import { selectLocalTime } from 'store/reducers/AccountSlice';
import { TournamentApi } from 'services/TournamentService';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { GroupApi } from 'services/GroupService';
import { FormattedMessage } from 'react-intl';


const MatchDistribution: React.FC = () => {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [blocksCnt, setBlocksCnt] = useState<number[]>([]);
    const [oldLocalTime, setOldLocalTime] = useState<string | null>(null);
    const inputValues = useAppSelector(selectInputValues);
    const selectedTeams = useAppSelector(selectSelectedTeams);
    const unselectedTeams = useAppSelector(selectUnselectedTeams);
    const dispatch = useAppDispatch();
    const groups = useAppSelector(selectGroups);
    const localTime = useAppSelector(selectLocalTime);
    const {data: fetchedTournaments} = TournamentApi.useFetchTournamentsQuery();
    const [postTournament] = TournamentApi.usePostTournamentMutation();
    const [deleteAllTournaments] = TournamentApi.useDeleteTournamentsMutation();
    const [cookies] = useCookies(['token']);
    const {data: registredTeams } = GroupApi.useFetchRegistredTeamsQuery(cookies.token);
    

    const handleIncreaseSlideIndex = () => {
        setSlideIndex((prev) => (prev < groups.length - 1) ? prev + 1 : 0);
    }

    const handleDecreaseSlideIndex = () => {
        setSlideIndex((prev) => (prev > 0) ? prev - 1 : groups.length - 1);
    }

    useEffect(() => {
        if (groups) {
            setBlocksCnt(groups.map((group) => Math.floor(group.teams.length / 2)));
        }
    }, [groups])

    useEffect(() => {
        if (groups && fetchedTournaments && selectedTeams) {
            const allTeams: number[][] = groups.map((group) => group.teams.map((team) => team.id || 0));
            const initialUnselectedTeams: number[][] = groups.map(() => []);
            
            allTeams.forEach((teams, index) => {
                teams = teams.filter(item => !selectedTeams.includes(item));                
                initialUnselectedTeams[index] = teams;
            })            
            dispatch(setUnselectedTeams(initialUnselectedTeams));
        }
    }, [groups, fetchedTournaments, selectedTeams])

    useEffect(() => {
        if (groups && blocksCnt.length > 0) {
            const initialInputValues = groups.map(() => Array(Math.max(...blocksCnt)).fill(['0', '0', localTime ? localTime : '0']));
            const initialSelectedTeams: number[] = [];
            let blockIndexes: number[] = Array(Math.max(...blocksCnt)).fill(0);

             
            if (fetchedTournaments) {                
                fetchedTournaments.forEach((tournament) => {
                    const groupIndex = groups.findIndex((group) => group.id === tournament.group);
                    
                    if (groupIndex !== -1) {
                        const blockIndex = blockIndexes[groupIndex];                       
                        if (blockIndex !== -1) {
                            initialInputValues[groupIndex][blockIndex] = [
                                tournament.team_one,
                                tournament.team_two,
                                tournament.match_start_time
                            ];
                            initialSelectedTeams.push(tournament.team_one);
                            initialSelectedTeams.push(tournament.team_two);
                            blockIndexes[groupIndex] = blockIndex + 1;
                        }
                    }
                });
            }
    
            dispatch(setInputValues(initialInputValues));
            dispatch(setSelectedTeams(initialSelectedTeams));
        }
    }, [groups, blocksCnt, fetchedTournaments]);

    useEffect(() => {
        if (inputValues && inputValues[slideIndex] && oldLocalTime) {            
            inputValues[slideIndex].forEach((block, index) => {
                if (block && block[2] === oldLocalTime) {
                    dispatch(setInputValues({
                        ...inputValues,
                        [slideIndex]: inputValues[slideIndex].map((block, i) => i === index ? [block[0], block[1], localTime] : block)
                    }));
                }
            })
        }
        setOldLocalTime(localTime);
    }, [localTime])

    
  return (
    <div className={classes.distrSlide}>
        <button 
                className={`${classes.button} ${classes.buttonLeft}`}
                onClick={() => handleDecreaseSlideIndex()}>&lt;</button>
        <div className={classes.distrSlideContent}>
            {groups && groups[slideIndex] && (
                <div className={classes.distrSlideItem}>
                    <h3 className={classes.distrSlideItemTitle}><FormattedMessage id="group" /> {groups[slideIndex].groupMark}</h3>
                    {blocksCnt[slideIndex] && Array.from({length: blocksCnt[slideIndex]}).map((_, index) => {                            
                        if (inputValues && inputValues[slideIndex] && inputValues[slideIndex][index]) {
                            return (<form className={classes.distrSlideItemBlock} key={index}>
                                <div className={classes.distrSlideItemBlockContent}>
                                    <select className={classes.distrSlideItemSelect} value={inputValues[slideIndex] ? inputValues[slideIndex][index][0] : 0}
                                            onChange={(e) => {
                                                const newInputValues = inputValues.map((group, i) => {
                                                    if (i === slideIndex) {                                            
                                                        return group.map((gr, j) => (j === index) ? [parseInt(e.target.value), gr[1], gr[2]] : [gr[0], gr[1], gr[2]]);
                                                    }
                                                    return group;
                                                });
                                                
                                                dispatch(setInputValues(newInputValues));
                                                if (inputValues[slideIndex] && inputValues[slideIndex][index] && inputValues[slideIndex][index][0] === '0') {
                                                    dispatch(setSelectedTeams([...selectedTeams, parseInt(e.target.value)]));
                                                    const newUnselected = unselectedTeams.map((group, i) => {
                                                        if (i === slideIndex) {
                                                            return group.filter((team) => team !== parseInt(e.target.value));
                                                        }
                                                        return group;
                                                    })
                                                    dispatch(setUnselectedTeams(newUnselected));
                                                } else {
                                                    const newSelectedTeams = selectedTeams.filter((team) => team.toString() !== inputValues[slideIndex][index][0]);
                                                    newSelectedTeams.push(parseInt(e.target.value));
                                                    
                                                    const newUnselected = unselectedTeams.map((group, i) => {
                                                        if (i === slideIndex) {
                                                            return group.filter((team) => team !== parseInt(e.target.value));
                                                        }
                                                        return group;
                                                    })

                                                    newUnselected[slideIndex].push(parseInt(inputValues[slideIndex][index][0]));
                                                    dispatch(setSelectedTeams(newSelectedTeams));
                                                    dispatch(setUnselectedTeams(newUnselected));
                                                };
                                                if (inputValues[slideIndex] && inputValues[slideIndex][index] && inputValues[slideIndex][index][1] !== '0') {                                                
                                                    postTournament({
                                                        tournament: {
                                                        group: groups[slideIndex].id,
                                                        team_one: parseInt(e.target.value),
                                                        team_two: parseInt(inputValues[slideIndex][index][1]),
                                                        match_start_time: (inputValues[slideIndex][index][2]),
                                                        stage: 0
                                                    }, 
                                                    token: cookies.token
                                                    });
                                                }
                                            }}>
                                        <option className={classes.distrSlideItemSelectOption} value="0" disabled><FormattedMessage id="selectTeam" /></option>
                                        {groups[slideIndex].teams.map((team, index) => {
                                            return <option className={classes.distrSlideItemSelectOption} value={team.id} key={index} disabled={selectedTeams.includes(team.id || -1)}>{team.name}</option>
                                        })}
                                    </select>
                                    <select className={classes.distrSlideItemSelect} name="" id="" value={inputValues[slideIndex] ? inputValues[slideIndex][index][1] : 0}
                                            onChange={(e) => {
                                                const newInputValues = inputValues.map((group, i) => {
                                                    if (i === slideIndex) {                                            
                                                        return group.map((gr, j) => (j === index) ? [gr[0], e.target.value, gr[2]] : [gr[0], gr[1], gr[2]]);
                                                    }
                                                    return group;
                                                });
                                                
                                                dispatch(setInputValues(newInputValues));
                                                if (inputValues[slideIndex] && inputValues[slideIndex][index] && inputValues[slideIndex][index][1] === '0') {
                                                    dispatch(setSelectedTeams([...selectedTeams, parseInt(e.target.value)]));
                                                    const newUnselected = unselectedTeams.map((group, i) => {
                                                        if (i === slideIndex) {
                                                            return group.filter((team) => team !== parseInt(e.target.value));
                                                        }
                                                        return group;
                                                    })
                                                    dispatch(setUnselectedTeams(newUnselected));
                                                } else {
                                                    const newSelectedTeams = selectedTeams.filter((team) => team.toString() !== inputValues[slideIndex][index][1]);
                                                    newSelectedTeams.push(parseInt(e.target.value));
                                                    
                                                    const newUnselected = unselectedTeams.map((group, i) => {
                                                        if (i === slideIndex) {
                                                            return group.filter((team) => team !== parseInt(e.target.value));
                                                        }
                                                        return group;
                                                    })

                                                    newUnselected[slideIndex].push(parseInt(inputValues[slideIndex][index][1]));
                                                    dispatch(setUnselectedTeams(newUnselected));
                                                    dispatch(setSelectedTeams(newSelectedTeams));
                                                }
                                                if (inputValues[slideIndex] && inputValues[slideIndex][index] && inputValues[slideIndex][index][0] !== '0') {                                                
                                                    postTournament({
                                                        tournament: {
                                                        group: groups[slideIndex].id,
                                                        team_one: parseInt(inputValues[slideIndex][index][0]),
                                                        team_two: parseInt(e.target.value),
                                                        match_start_time: (inputValues[slideIndex][index][2]),
                                                        stage: 0
                                                    }, 
                                                    token: cookies.token
                                                    });
                                                }
                                            }}>
                                        <option className={classes.distrSlideItemSelectOption} value="0" disabled><FormattedMessage id="selectTeam" /></option>
                                        {groups[slideIndex].teams.map((team, index) => (
                                            <option className={classes.distrSlideItemSelectOption} value={team.id} key={index} disabled={selectedTeams.includes(team.id || -1)}>{team.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <input className={classes.distrSlideItemInput} type="datetime-local" name="" id="" value={inputValues[slideIndex] ? moment(inputValues[slideIndex][index][2]).format('YYYY-MM-DDTHH:mm') : ''} 
                                onChange={
                                    (e) => {
                                        const newInputValues = inputValues.map((group, i) => {
                                            if (i === slideIndex) {                                            
                                                return group.map((gr, j) => (j === index) ? [gr[0], gr[1], e.target.value] : [gr[0], gr[1], gr[2]]);
                                                
                                            }
                                            return group;
                                        });
                                        
                                        dispatch(setInputValues(newInputValues));
                                        if (inputValues[slideIndex] && inputValues[slideIndex][index] && inputValues[slideIndex][index][1] !== '0' && inputValues[slideIndex][index][0] !== '0') {
                                            
                                            postTournament({
                                                tournament: {
                                                group: groups[slideIndex].id,
                                                team_one: parseInt(inputValues[slideIndex][index][0]),
                                                team_two: parseInt(inputValues[slideIndex][index][1]),
                                                match_start_time: (e.target.value),
                                                stage: 0
                                            }, 
                                            token: cookies.token
                                            });
                                            
                                        }
                                    }
                                }/>
                                </form>)
                        } else {
                            return null
                        }
                    })}
                    {(  groups[slideIndex].teams.length / 2 !== 0) && registredTeams && registredTeams.length > 0 && 
                        unselectedTeams && unselectedTeams[slideIndex] && 
                        unselectedTeams[slideIndex].length === 1 && (
                        <div>
                            {registredTeams.map((team) => (
                                unselectedTeams[slideIndex].includes(team.id || -1) &&
                                <div><h3>{team.name}&nbsp;<FormattedMessage id="autoOut" /></h3></div>
                            ))}
                        </div>
                    )}
                    <Button7x className={classes.distrSlideItemButton} onClick={() => {
                        dispatch(setInputValues(groups.map(() => Array(blocksCnt[slideIndex]).fill([0, 0, localTime ? localTime : '']))));
                        dispatch(setSelectedTeams([]));
                        deleteAllTournaments({token: cookies.token});
                    }} ><FormattedMessage id="reset" /></Button7x>
                </div>
            )}
        </div>
        <button 
                className={`${classes.button} ${classes.buttonRight}`}
                onClick={() => handleIncreaseSlideIndex()}>&gt;</button>
    </div>
  );
};

export default MatchDistribution;