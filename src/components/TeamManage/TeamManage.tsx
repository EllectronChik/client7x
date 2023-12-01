import React from 'react';
import ClanInfo from './ClanInfo/ClanInfo';
import Participate from './Participate/Participate';
import classes from './TeamManage.module.scss';


const TeamManage: React.FC = () => {

  return (
    <div className={classes.teamManage}>
      <ClanInfo />
      <Participate />
    </div>
  )
}

export default TeamManage