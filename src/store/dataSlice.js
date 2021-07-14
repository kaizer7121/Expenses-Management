import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    paymentMethods: [],
    memberInList: [],
    memberInfoInList: [],
    allUserInfo: [],
    isMemberDataSend: false,
  },
  reducers: {
    getPaymentMethodsFromFireStore(state, action) {
      const paymentMethods = action.payload;
      state.paymentMethods = paymentMethods;
    },
    updateMemberFromFireStore(state, action) {
      const { memberInList, memberInfoInList } = action.payload;
      state.memberInList = memberInList;
      state.memberInfoInList = memberInfoInList;
      state.isMemberDataSend = true;
    },
    addMemberToStore(state, action) {
      const { newMembersInList, memberInfoInList } = action.payload;
      state.memberInfoInList = memberInfoInList;
      state.memberInList = [...state.memberInList, ...newMembersInList];
    },
    getAllUserInfo(state, action) {
      const allUserInfo = action.payload;
      state.allUserInfo = allUserInfo;
    },
    deleleData(state) {
      state.memberInList = [];
      state.memberInfoInList = [];
      state.paymentMethods = [];
      state.allUserInfo = [];
      state.isMemberDataSend = false;
    },
    updateNameOfUser(state, action) {
      const { userID, newName } = action.payload;
      let tempData = [...state.memberInfoInList];
      const selectedIndex = tempData.findIndex((el) => el.userID === userID);
      const oldObject = tempData[selectedIndex];
      tempData[selectedIndex] = { ...oldObject, name: newName };
      state.memberInfoInList = [...tempData];
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
  },
});

export const dataAction = dataSlice.actions;
export default dataSlice;
