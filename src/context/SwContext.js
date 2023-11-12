import { createContext, useCallback, useContext, useEffect, useState } from "react";

const defaultValue = {
    // updated: false,
    // setUpdated: () => {},
    // success: false,
    // setSuccess: () => {},
    // registration: null,
    // setRegistration: () => {},
    // activateWaitingServiceWorker: () => {}
    activeRegistration: null,
    waitingRegistration: null, 
    installUpdate: () => { console.warn("no-op installUpdate") }
};

export const SwContext = createContext(defaultValue);

const SwContextProvider = ({children, onUpdate, ...props}) => {

    const [activeRegistration, setActiveRegistration] = useState(null);
    const [waitingRegistration, setWaitingRegistration] = useState(null);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                setActiveRegistration(registration);
                const waitingRegistration = registration.waiting;
                if(waitingRegistration) {
                    setWaitingRegistration(waitingRegistration);
                }
            })
        }
    }, []);

    useEffect(() => {
        if(activeRegistration) {
            const id = setInterval(() => {
                activeRegistration.update();
            }, 1000);
            return () => {
                clearInterval(id);
            }
        }
    }, [])

    const installUpdate = useCallback(() => {
        if (waitingRegistration) {
          waitingRegistration.postMessage({ type: 'SKIP_WAITING' });
          waitingRegistration.addEventListener('statechange', e => {
            if (e.target.state === 'activated') {
              window.location.reload();
            }
          });
        }
    }, [waitingRegistration]);

    const value = {
        activeRegistration,
        waitingRegistration,
        installUpdate
    }

    return (
        <SwContext.Provider value={value} {...props}>
            {children}
        </SwContext.Provider>
    )

}

export default SwContextProvider;