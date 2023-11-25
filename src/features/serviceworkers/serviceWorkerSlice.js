import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialized: false,
    updated: false,
    registration: null,
};

const serviceWorkerSlice = createSlice({
    name: "serviceWorkers",
    initialState,
    reducers: {
        initializeSw: (state, action) => {
            state.initialized = true;
            state.registration = action.payload;
        },
        updateAvailableForSw: (state, action) => {
            state.updated = true;
            state.registration = action.payload;
        }
    }
});

export const { initializeSw, updateAvailableForSw, setSw } = serviceWorkerSlice.actions;
export default serviceWorkerSlice.reducer;