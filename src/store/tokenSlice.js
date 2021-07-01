import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: localStorage.getItem("token"),
    expirationTime: 0,
  },
  reducers: {
    addToken(state, action) {
      const { token, expiredTime } = action.payload;

      localStorage.setItem("token", token);

      state.token = token;
      state.expirationTime = expiredTime;
    },
    deleteToken(state, action) {
      localStorage.removeItem("token");
      state.token = null;
      state.expirationTime = 0;
    },
  },
});

export const tokenAction = tokenSlice.actions;
export default tokenSlice;
