import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSw, updateAvailableForSw } from "./serviceWorkerSlice";
import { Stack, Typography, Button } from "@mui/material";

export const useCheckForUpdates = () => {

  const registration = useSelector(state => state.serviceWorkers.registration);
  const dispatch = useDispatch();

  const checkForUpdates = useCallback(() => {
    if(registration) {
      console.log("checking for updates")
      // If the user has refreshed the page after an update becomes
      // available then the "updated" state will be reset, and since
      // the onUpdate callback only calls after installation then it'll
      // never be called again. But, we CAN see there is a waiting registration
      // if an update is available, so check for this and re-trigger the 
      // updated state so the user can install the update
      if(registration.waiting) {
        dispatch(updateAvailableForSw(registration));
      } else {
        // Otherwise ask the service worker to do a normal check for updates
        registration.update();
      }
    } else {
      console.error("No registration yet")
    }
  }, [registration]);

  useEffect(() => {
    // If there is already a service worker registration 
    // active, then make it available in the state
    navigator.serviceWorker.ready.then(reg => {
      console.log("found ready serviceworker", reg)
      dispatch(initializeSw(reg));
    });

  }, []);

  return [checkForUpdates];

}

export const useSwInstallUpdate = () => {

  const registration = useSelector(state => state.serviceWorkers.registration);
  const updated = useSelector(state => state.serviceWorkers.updated);

  const installUpdate = useCallback(() => {
    // If there is a waiting registration then all the assets
    // have been installed and cached, and are ready to become
    // active. Dispatch a skip waiting event to trigger the 
    // worker to activate the waiting registration
    const registrationWaiting = registration.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [registration]);

  return [updated, installUpdate];

}

export const useCheckForUpdatesInterval = (intervalMs) => {

  const [checkForUpdates] = useCheckForUpdates();

  // Periodically check for updates in the background 
  // so the user will be notified of when an app update is 
  // available
  useEffect(() => {

      const id = setInterval(() => {
        console.log("Scheduled check for updates")
        checkForUpdates();
      }, intervalMs);

      return () => {
        clearInterval(id);
      }

  }, [checkForUpdates])

}

export const CheckForUpdatesButton = ({checkMessage="Check for updates", noUpdatesMessage="No updates available"}, ButtonProps, TypographyProps) => {

  const [updatesAvailableMessage, setUpdatesAvailableMessage] = useState("");
  const [checkForUpdates] = useCheckForUpdates();
  const updated = useSelector(state => state.serviceWorkers.updated);

  // handle the user clicking the "check for updates" button
  // by invoking the check and setting the message to "none available".
  // note that since the updated state could be out of sync from the 
  // timeout event thread, then we decide whether to display that message
  // in the JSX instead of here.
  const onClick = () => {
    setUpdatesAvailableMessage("");
    checkForUpdates();
    setTimeout(() => {
      setUpdatesAvailableMessage(noUpdatesMessage);
    }, 500);
  };

  return (
    <Stack>
      <Button 
        disabled={updated} 
        onClick={onClick}
        {...ButtonProps}
      >
        {checkMessage}
      </Button>
      {updated ? null : <Typography {...TypographyProps}>{updatesAvailableMessage}</Typography> }
    </Stack>
  );

}

// export const useServiceWorkerInitialized = () => {

//   const initialized = useSelector(state => state.serviceWorkers.initialized);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // If there is already a service worker registration 
//     // active, then make it available in the state
//     navigator.serviceWorker.ready.then(reg => {
//       console.log("found ready serviceworker", reg)
//       dispatch(initializeSw(reg));
//     });

//   }, []);

//   return [initialized];
  
// }