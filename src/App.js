import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Alert, Button } from '@mui/material';
import { CheckForUpdatesButton, useCheckForUpdatesInterval, useServiceWorkerInitialized, useSwInstallUpdate } from './features/serviceworkers/useServiceWorkers';

const version = "1.0.6";

function App() {

  const [updated, installUpdate] = useSwInstallUpdate();
  useCheckForUpdatesInterval(1000);
  const initialized = useServiceWorkerInitialized();

  return (
    <div className="App">
      {initialized ? <Alert>App is now available offline!</Alert> : null}
      {updated ? <Alert action={<Button onClick={installUpdate}>Install</Button>}>A new update is available</Alert> : null}
      <header className="App-header">
        <p>You are now using version {version}</p>
        <CheckForUpdatesButton />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
