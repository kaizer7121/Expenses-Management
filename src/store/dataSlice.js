import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    memberInList: [],
    memberInfoInList: [],
    allUserInfo: [],
    isMemberDataSend: false,
  },
  reducers: {
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
    addDebtOfUser(state, action) {
      const { userID, debt } = action.payload;
      let tempData = [...state.memberInfoInList];
      const selectedIndex = tempData.findIndex((el) => el.userID === userID);
      const oldObject = tempData[selectedIndex];
      const oldDebt = state.memberInfoInList[selectedIndex].debt;
      tempData[selectedIndex] = { ...oldObject, debt: oldDebt + debt };
      state.memberInfoInList = [...tempData];
    },
  },
});

export const dataAction = dataSlice.actions;
export default dataSlice;
