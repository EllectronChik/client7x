import React, { useEffect } from 'react'

const TeamManage: React.FC = () => {
  useEffect(() => {
    document.title = 'Team Manage'
  }, [])
  return (
    <div>TeamManager</div>
  )
}

export default TeamManage