import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { ManagerApi } from 'services/ManagerService';
import { IManager } from './../../models/IManager';
import { useNavigate } from 'react-router';

const Account: React.FC = () => {
    const [isManager, setIsManager] = useState<boolean>(false);
    const [cookie_id, setCookie_id] = useCookies(['userId']);
    const navigate = useNavigate();

    if (cookie_id.userId) {
        const {data: manager, error, isLoading} = ManagerApi.useFetchUserManagerQuery(cookie_id.userId);
        useEffect(() => {
            setIsManager(manager ? true : false);
        }, [manager]);
        console.log(manager);
        
        return (
            <div>
                {isLoading && <h1>Loading</h1>}
                {isManager && <h1>Outlook</h1> }
                {!isManager && !isLoading && <h1>Google</h1>}
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