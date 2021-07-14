import { configureStore } from "@reduxjs/toolkit";

import tokenSlice from "./tokenSlice";
import authSlice from "./authSlice";
import dataSlice from "./dataSlice";

const store = configureStore({
  reducer: {
    token: tokenSlice.reducer,
    auth: authSlice.reducer,
    data: dataSlice.reducer,
  },
});

export default store;
