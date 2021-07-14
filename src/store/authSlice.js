import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "loginUser",
  initialState: {
    userID: "",
    phone: "",
    name: "",
    debt: 0,
    role: "",
  },
  reducers: {
    login(state, action) {
      const { userID, phone, name, debt, role } = action.payload;
      state.userID = userID;
      state.phone = phone;
      state.name = name;
      state.debt = +debt;
      state.role = role;
    },
    logout(state) {
      state.userID = "";
      state.phone = "";
      state.name = "";
      state.debt = 0;
      state.role = "";
    },
    updateProfile(state, action) {
      const name = action.payload;
      state.name = name;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
