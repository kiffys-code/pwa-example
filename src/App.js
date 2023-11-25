import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { setSw, updateAvailableForSw } from './features/serviceworkers/serviceWorkerSlice';
import { CheckForUpdatesButton, useCheckForUpdates, useCheckForUpdatesInterval, useServiceWorkerInitialized, useSwInstallUpdate } from './features/serviceworkers/useServiceWorkers';

const version = "1.0.5";

function App() {

  // const initialized = useSelector(state => state.serviceWorkers.initialized);
  // const updated = useSelector(state => state.serviceWorkers.updated);
  // const registration = useSelector(state => state.serviceWorkers.registration);
  // const dispatch = useDispatch();
  // // const checkForUpdates = useSelector(state => state.serviceWorkers.checkForUpdates);
  // const [updatesAvailableMessage, setUpdatesAvailableMessage] = useState("");

  // const checkForUpdates = useCallback(() => {
  //   if(registration) {
  //     console.log("checking for updates")
  //     // If the user has refreshed the page after an update becomes
  //     // available then the "updated" state will be reset, and since
  //     // the onUpdate callback only calls after installation then it'll
  //     // never be called again. But, we CAN see there is a waiting registration
  //     // if an update is available, so check for this and re-trigger the 
  //     // updated state so the user can install the update
  //     if(registration.waiting) {
  //       dispatch(updateAvailableForSw(registration));
  //     } else {
  //       // Otherwise ask the service worker to do a normal check for updates
  //       registration.update();
  //     }
  //   } else {
  //     console.error("No registration yet")
  //   }
  // }, [registration])

  // console.log({initialized, updated, registration})

  // const installUpdate = () => {
  //   // If there is a waiting registration then all the assets
  //   // have been installed and cached, and are ready to become
  //   // active. Dispatch a skip waiting event to trigger the 
  //   // worker to activate the waiting registration
  //   const registrationWaiting = registration.waiting;
  //   if (registrationWaiting) {
  //     registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
  //     registrationWaiting.addEventListener('statechange', e => {
  //       if (e.target.state === 'activated') {
  //         window.location.reload();
  //       }
  //     });
  //   }
  // }

  // useEffect(() => {
  //   // If there is already a service worker registration 
  //   // active, then make it available in the state
  //   navigator.serviceWorker.ready.then(reg => {
  //     console.log("found ready serviceworker", reg)
  //     dispatch(setSw(reg))
  //   });
  // }, []);

  // // Periodically check for updates in the background 
  // // so the user will be notified of when an app update is 
  // // available
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.log("Scheduled check for updates")
  //     checkForUpdates();
  //   }, 5000);
  //   return () => {
  //     clearInterval(id);
  //   }
  // }, [checkForUpdates])

  // // handle the user clicking the "check for updates" button
  // // by invoking the check and setting the message to "none available".
  // // note that since the updated state could be out of sync from the 
  // // timeout event thread, then we decide whether to display that message
  // // in the JSX instead of here.
  // const onClickCheckForUpdates = () => {
  //   setUpdatesAvailableMessage("");
  //   checkForUpdates();
  //   setTimeout(() => {
  //     setUpdatesAvailableMessage("No updates available");
  //   }, 500);
  // }

  // const [initialized] = useServiceWorkerInitialized();
  const [updated, installUpdate] = useSwInstallUpdate();
  useCheckForUpdatesInterval(1000);

  return (
    <div className="App">
      {/* {initialized ? <Alert>App is initialized and now available offline!</Alert> : null} */}
      {updated ? <Alert action={<Button onClick={installUpdate}>Install</Button>}>A new update is available</Alert> : null}
      <header className="App-header">
        <p>You are now using version {version}</p>
        {/* <Stack>
          <Button disabled={updated} onClick={onClickCheckForUpdates}>Check for updates</Button>
          
              It's possible for the periodic check loop to find an update but  the updated state 
              to be outdated. So, rather than check it in the loop there, we check it here.
         
          {updated ? null : <Typography>{updatesAvailableMessage}</Typography> }
        </Stack> */}
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
