import { configureStore } from "@reduxjs/toolkit";

import tokenSlice from "./tokenSlice";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: { token: tokenSlice.reducer, auth: authSlice.reducer },
});

export default store;
