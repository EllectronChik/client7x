import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { StatusApi } from 'services/StatusService';
import { useNavigate } from 'react-router';
import Loader7x from 'components/UI/Loader7x/Loader7x';
import classes from './Account.module.scss';
import { useLogoutUser } from 'hooks/useLogoutUser';
import Button7x from 'components/UI/Button7x/Button7x';
import Input7x from 'components/UI/Input7x/Input7x';
import PlayersList from 'components/PlayersList';

const Account: React.FC = () => {
    const [isManager, setIsManager] = useState<boolean>(false);
    const [isStaff, setIsStaff] = useState<boolean>(false);
    const [pageManager, setPageManager] = useState<number>(0);
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
            if (!isStaff && !isManager) {
                setPageManager(0);
            } else if (isManager && !isStaff) {
                setPageManager(1);
            } else if (!isManager && isStaff) {
                setPageManager(2);
            }
        }, [isManager, isStaff]);
        return (
            <div className={classes.container}>
                {isManager && isStaff && 
                <div className={classes.bttns}>
                    <button 
                        onClick={() => setPageManager(1)}
                        className={`${pageManager ? classes.active : ''} ${classes.btn}`}>TEAM</button>
                    <button 
                        onClick={() => setPageManager(2)}
                        className={`${pageManager ? '' : classes.active} ${classes.btn}`}>STAFF</button>
                </div>}
                {isLoading && <Loader7x />}
                {pageManager === 0 && 
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
                    {renderList && <div>
                        <PlayersList tag={clanTag} />
                        <Button7x onClick={() => setRenderList(false)} >Return</Button7x>
                    </div>}
                </div>
                }
                {pageManager === 1 &&
                <div>Team</div>
                }
                {pageManager === 2 &&
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