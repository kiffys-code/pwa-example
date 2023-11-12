import { configureStore } from "@reduxjs/toolkit";
import serviceWorkerSlice from "./serviceWorkerSlice";

const store = configureStore({
    reducer: {
        serviceWorkers: serviceWorkerSlice
    }
});

export default store;