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

const Account: React.FC = () => {
    const dispatch = useAppDispatch();
    const pageManager = useAppSelector(selectManagerPage);
    const [isManager, setIsManager] = useState<boolean | null>(null);
    const [isStaff, setIsStaff] = useState<boolean | null>(null);
    const [clanTag, setClanTag] = useState<string>('');
    const [renderList, setRenderList] = useState<boolean>(false);
    const [cookie, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const logout = useLogoutUser();



    if (cookie.token) {
        const {data: status, error, isLoading} = StatusApi.useFetchUserStatusQuery(cookie.token);

        useEffect(() => {
            document.title = 'Account';
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
                    dispatch(setPageManager(3));
                }         
        }, [isManager, isStaff]);
        return (
            <div className={classes.container}>
                {isManager && isStaff && 
                <div className={classes.bttns}>
                    <button 
                        onClick={() => dispatch(setPageManager(0))}
                        className={`${pageManager ? classes.active : ''} ${classes.btn}`}>TEAM</button>
                    <button 
                        onClick={() => dispatch(setPageManager(1))}
                        className={`${pageManager ? '' : classes.active} ${classes.btn}`}>STAFF</button>
                </div>}
                {isLoading && <Loader7x />}
                {pageManager === 0 && !isLoading && 
                <div>
                    {!renderList && <form className={classes.tag_form} onSubmit={
                    (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setRenderList(true);
                    }
                    }>
                        <Input7x type="text" placeholder="ClanTag" onChange={(e) => setClanTag(e.target.value)}/>
                    <Button7x className={classes.search_btn}>Search</Button7x>
                    </form>}
                    {renderList && <div className={classes.players_list}>
                        <PlayersList tag={clanTag} />
                        <Button7x className={classes.return_btn} onClick={() => setRenderList(false)} >Return</Button7x>
                    </div>}
                </div>
                }
                {pageManager === 1 && !isLoading &&
                <div>Team</div>
                }
                {pageManager === 2 && !isLoading &&
                <div>Staff</div>
                }
                <Button7x className={classes.logout_btn} onClick={() => {
                    logout();
                    navigate('/login');
                }}>Logout</Button7x>
            </div>
          )
        } else { 
            useEffect(() => {
                navigate('/login');
            }, [])
        }

}

export default Account