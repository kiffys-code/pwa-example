import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialized: false,
    updated: false,
    registration: null,
    // checkForUpdates: () => { console.error("Update failed: No service workers are registered yet!")}
};

const serviceWorkerSlice = createSlice({
    name: "serviceWorkers",
    initialState,
    reducers: {
        initializeSw: (state) => {
            console.log({initialized: {state}})
            state.initialized = true;
            // state.registration = action.payload;
            // state.checkForUpdates = action.payload.update;
            // return state;
        },
        updateAvailableForSw: (state, action) => {
            console.log({updated: {state, action}})
            state.updated = true;
            state.registration = action.payload;
            // state.checkForUpdates = action.payload.update;
            // return state;
        },
        setSw: (state, action) => {
            state.registration = action.payload;
            // return state;
        }
    }
});

export const { initializeSw, updateAvailableForSw, setSw } = serviceWorkerSlice.actions;
export default serviceWorkerSlice.reducer;