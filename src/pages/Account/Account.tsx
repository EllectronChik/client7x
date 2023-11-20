import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { StatusApi } from 'services/StatusService';
import { useNavigate } from 'react-router';
import Loader7x from 'components/UI/Loader7x/Loader7x';
import classes from './Account.module.scss';
import { useLogoutUser } from 'hooks/useLogoutUser';
import Button7x from 'components/UI/Button7x/Button7x';
import Input7x from 'components/UI/Input7x/Input7x';
import PlayersList from 'components/PlayersList/PlayersList';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { setPageManager, selectManagerPage } from 'store/reducers/pageManagerSlice';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import TeamManage from 'components/TeamManage/TeamManage';
import { FormattedMessage } from 'react-intl';
import StaffPanel from 'components/StaffPanel/StaffPanel';

const Account: React.FC = () => {
    const dispatch = useAppDispatch();
    const pageManager = useAppSelector(selectManagerPage);
    const [isManager, setIsManager] = useState<boolean | null>(null);
    const [isStaff, setIsStaff] = useState<boolean | null>(null);
    const [clanTag, setClanTag] = useState<string>('');
    const [isAsked, setIsAsked] = useState<boolean>(false);
    const [renderList, setRenderList] = useState<boolean>(false);
    const [cookie, ] = useCookies(['token', 'userId']);
    const navigate = useNavigate();
    const logout = useLogoutUser();

    const askClanTag = async () => {
        try {
            const isAskStaffSend = await axios({
                url: `${import.meta.env.VITE_API_URL}ask_for_staff/?user=${cookie.userId}`,
                method: 'GET',
                headers: {
                    Authorization: `Token ${cookie.token}`
                }
            });       
            if (isAskStaffSend.data.length === 1) {
                setIsAsked(true);
            }
            
        } catch (error) {
            console.error("Error when asking for the clan tag:", error);
        }
    }

    if (cookie.token) {
        const {data: status, isLoading} = StatusApi.useFetchUserStatusQuery(cookie.token);

        useEffect(() => {
            document.title = 'Account';
            askClanTag();
        }, []);

        useEffect(() => {
            if (status) {
                setIsManager(status.is_manager),
                setIsStaff(status.is_staff)                
            };
        }, [status]);

        useEffect(() => {
                if (isStaff === false && isManager === false) {
                    dispatch(setPageManager(0));
                } else if (isManager && !isStaff) {
                    dispatch(setPageManager(1));
                } else if (!isManager && isStaff) {
                    dispatch(setPageManager(2));
                } else if (isManager && isStaff) {
                    dispatch(setPageManager(1));
                }         
        }, [isManager, isStaff]);
        return (
            <div className={classes.container}>
                {isManager && isStaff && 
                <div className={classes.bttns}>
                    <button 
                        onClick={() => dispatch(setPageManager(1))}
                        className={`${(pageManager === 1) ? classes.active : ''} ${classes.btn}`}><FormattedMessage id="team" /></button>
                    <button 
                        onClick={() => dispatch(setPageManager(2))}
                        className={`${(pageManager === 2) ? classes.active : ''} ${classes.btn}`}><FormattedMessage id="staff" /></button>
                </div>}
                {isLoading && <Loader7x />}
                {pageManager === 0 && !isLoading && 
                <div className={classes.clan}>
                    {!renderList && <form className={classes.tag_form} onSubmit={
                    (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setRenderList(true);
                    }
                    }>
                         <Tooltip border='1px solid red' id="tooltip-important-content">
                            <div>
                            <p>
                            <FormattedMessage id="clanTag_tooltip" values={{br: <br />}} />
                            </p>
                            </div>
                         </Tooltip>
                         <div className={classes.input_container}>
                        <Input7x
                            data-tooltip-id='tooltip-important-content'
                            data-tooltip-place='left'
                            type="text" placeholder="ClanTag" onChange={(e) => setClanTag(e.target.value)}/>
                    <Button7x className={classes.search_btn}><FormattedMessage id="search" /></Button7x>
                    </div>
                    <a className={classes.link} href="https://sc2pulse.nephest.com"><FormattedMessage id="API_mention" values={{inLink:<span className={classes.inLink}>SC2 PULSE</span>}} /></a>
                    </form>}
                    {renderList && <div className={classes.players_list}>
                        <PlayersList tag={clanTag} />
                        <Button7x className={classes.return_btn} onClick={() => setRenderList(false)} ><FormattedMessage id="return" /></Button7x>
                    </div>}
                </div>
                }
                {pageManager === 1 && !isLoading &&
                <TeamManage />
                }
                {pageManager === 2 && !isLoading &&
                <StaffPanel />
                }
                {/* {!isAsked && !isStaff && <div className={classes.request_btn}
                    onClick={() => {
                    axios.post(`${import.meta.env.VITE_API_URL}ask_for_staff/`, {
                        user: cookie.userId,
                        }, {
                            headers: {
                                'Authorization': `Token ${cookie.token}`
                            }
                        })
                    setIsAsked(true);
                    }}><FormattedMessage id="referee_ask" /></div>} */}
                <Button7x className={classes.logout_btn} onClick={() => {
                    logout();
                    navigate('/login');
                }}><FormattedMessage id="logout" /></Button7x>
            </div>
          )
        } else { 
            useEffect(() => {
                navigate('/login');
            }, [])
        }

}

export default Account