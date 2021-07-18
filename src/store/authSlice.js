import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "loginUser",
  initialState: {
    userID: "",
    phone: "",
    name: "",
    debt: 0,
    role: "",
    paymentMethods: [{ empty: true }],
    relatedBills: [{ empty: true }],
    userInfoEachBill: [{ empty: true }],
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
    getPaymentMethodsFromFireStore(state, action) {
      const paymentMethods = action.payload;
      state.paymentMethods = paymentMethods;
    },
    addPaymentMethods(state, action) {
      const newPaymentMethods = action.payload;
      state.paymentMethods = [...state.paymentMethods, ...newPaymentMethods];
    },
    deletePaymentMethods(state, action) {
      const deletedPaymentMethods = action.payload;
      let tempData = [...state.paymentMethods];
      tempData = tempData.filter(
        (el) => !deletedPaymentMethods.find((delEl) => el.id === delEl.id)
      );
      state.paymentMethods = [...tempData];
    },
    getUserInfoEachBill(state, action) {
      const userInfoEachBill = action.payload;
      state.userInfoEachBill = userInfoEachBill;
    },
    addUserInfoEachBill(state, action) {
      const newInfo = action.payload;
      state.userInfoEachBill = [...state.userInfoEachBill, newInfo];
    },
    getRelatedBillsFromFireStore(state, action) {
      const relatedBills = action.payload;
      state.relatedBills = [...relatedBills];
    },
    addRelatedBill(state, action) {
      const newRelatedBill = action.payload;
      state.relatedBills = [...state.relatedBills, newRelatedBill];
    },
    editRelatedBill(state, action) {
      const { billID, newBillInfo } = action.payload;
      let tempData = [...state.ownBills];
      const selectedIndex = tempData.findIndex((el) => el.id === billID);
      tempData[selectedIndex] = { ...newBillInfo };
      state.relatedBills = [...tempData];
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
