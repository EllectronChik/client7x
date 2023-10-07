import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { StatusApi } from 'services/StatusService';
import { useNavigate } from 'react-router';
import Loader7x from 'components/UI/Loader7x/Loader7x';
import classes from './Account.module.scss';
import { useLogoutUser } from 'hooks/useLogoutUser';
import Button7x from 'components/UI/Button7x/Button7x';

const Account: React.FC = () => {
    const [isManager, setIsManager] = useState<boolean>(false);
    const [isStaff, setIsStaff] = useState<boolean>(false);
    const [pageManager, setPageManager] = useState<number>(0);
    const [cookie, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const logout = useLogoutUser();

    if (cookie.token) {
        const {data: status, error, isLoading} = StatusApi.useFetchUserStatusQuery(cookie.token);
        useEffect(() => {
            if (status) {
                console.log(status);
                
                setIsManager(status.is_manager),
                setIsStaff(status.is_staff)
                if (!isStaff && !isManager) {
                    setPageManager(0);
                } else if (isManager && !isStaff) {
                    setPageManager(1);
                } else if (!isManager && isStaff) {
                    setPageManager(2);
                }
                console.log(pageManager);
                
            };

        }, [status]);
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
                    
                </div>
                }
                {pageManager === 1 &&
                <div>Team</div>
                }
                {pageManager === 2 &&
                <div>Staff</div>
                }
                <Button7x className={classes.button} onClick={() => {
                    logout();
                    navigate('/login');
                }}>Logout</Button7x>
            </div>
          )
        } else { 
            console.log('redirect');
            useEffect(() => {
                navigate('/login');
            }, [])
        }

}

export default Account