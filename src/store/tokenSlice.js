import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: localStorage.getItem("token"),
    expirationTime: localStorage.getItem("expirationTime"),
  },
  reducers: {
    addToken(state, action) {
      const { token, expirationTime } = action.payload;


      localStorage.setItem("token", token);
      localStorage.setItem("expirationTime", expirationTime);

      state.token = token;
      state.expirationTime = expirationTime;
    },
    deleteToken(state, action) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      state.token = null;
      state.expirationTime = 0;
    },
  },
});

export const tokenAction = tokenSlice.actions;
export default tokenSlice;
