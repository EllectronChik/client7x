import React, { useEffect } from 'react'

const ReloadinWarning: React.FC = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = 'You have unsaved data left on the page. They will not be saved on reloading. Are you sure?'
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [])
  return (null)
}

export default ReloadinWarning