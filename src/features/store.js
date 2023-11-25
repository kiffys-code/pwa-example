import { configureStore } from "@reduxjs/toolkit";
import serviceWorkerSlice from "./serviceworkers/serviceWorkerSlice";

const store = configureStore({
    reducer: {
        serviceWorkers: serviceWorkerSlice
    }
});

export default store;