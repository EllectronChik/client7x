import React, { useEffect } from 'react';
import './App.scss';
import AppRouter from './components/AppRouter';

function App() {
  useEffect(() => {
    document.title = '7x League';
  }, [])
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
