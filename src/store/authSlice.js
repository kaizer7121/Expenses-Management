import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "loginUser",
  initialState: {
    userID: "",
    phone: "",
    name: "",
    debt: 0,
    role: "",
    permission: "",
    paymentMethods: [{ empty: true }],
    relatedBills: [{ empty: true }],
    userInfoEachBill: [{ empty: true }],
  },
  reducers: {
    login(state, action) {
      const { userID, phone, name, debt, role, permission } = action.payload;
      state.userID = userID;
      state.phone = phone;
      state.name = name;
      state.debt = +debt;
      state.role = role;
      state.permission = permission;
    },
    logout(state) {
      state.userID = "";
      state.phone = "";
      state.name = "";
      state.debt = 0;
      state.role = "";
      state.permission = "";
      state.paymentMethods = [{ empty: true }];
      state.relatedBills = [{ empty: true }];
      state.userInfoEachBill = [{ empty: true }];
    },
    updateProfile(state, action) {
      const name = action.payload;
      state.name = name;
    },
    changePermission(state, action) {
      const permission = action.payload;
      state.permission = permission;
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
    removeUserInfoEachBill(state, action) {
      const id = action.payload;
      let tempData = [...state.userInfoEachBill];
      const removedIndex = tempData.findIndex((el) => el.id === id);
      tempData.splice(removedIndex, 1);
      state.userInfoEachBill = [...tempData];
    },
    editUserInfoEachBill(state, action) {
      const { id, newInfo } = action.payload;
      let tempData = [...state.userInfoEachBill];
      const selectedIndex = tempData.findIndex((el) => el.id === id);
      tempData[selectedIndex] = { ...tempData[selectedIndex], ...newInfo };
      state.userInfoEachBill = [...tempData];
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
      let tempData = [...state.relatedBills];
      const selectedIndex = tempData.findIndex((el) => el.id === billID);
      tempData[selectedIndex] = { ...tempData[selectedIndex], ...newBillInfo };
      state.relatedBills = [...tempData];
    },
    editDebt(state, action) {
      const debt = action.payload;
      state.debt = debt;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
