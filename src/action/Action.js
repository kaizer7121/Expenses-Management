import { db } from "../Firebase";
import { authAction } from "../store/authSlice";
import { dataAction } from "../store/dataSlice";
import firebase from "firebase/app";
import "firebase/firestore";

export const randomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const convertPhoneNumber = (phoneNum) => {
  let convertedPhoneNumber = phoneNum;
  if (convertedPhoneNumber.charAt(0) === "0") {
    convertedPhoneNumber = convertedPhoneNumber.substring(1);
  }
  if (convertedPhoneNumber.includes("+840")) {
    convertedPhoneNumber = convertedPhoneNumber.substring(4);
  }
  if (!convertedPhoneNumber.includes("+84", 0)) {
    convertedPhoneNumber = `+84${convertedPhoneNumber}`;
  }
  return convertedPhoneNumber;
};

export const deconvertPhoneNumber = (convertedPhone) => {
  let deconvertedPhoneNumber = convertedPhone;
  if (deconvertedPhoneNumber.includes("+84", 0)) {
    deconvertedPhoneNumber = `0${deconvertedPhoneNumber.substring(3)}`;
  }
  return deconvertedPhoneNumber;
};

export const getMonthAndYearOfDate = (date) => {
  const getDate = new Date(date);
  const month = getDate.getMonth() + 1;
  const year = getDate.getFullYear();
  const result = `${month}/${year}`;
  return result;
};

export const getDayMonthAndYearOfDate = (date) => {
  const getDate = new Date(date);
  const day = getDate.getDate();
  const month = getDate.getMonth() + 1;
  const year = getDate.getFullYear();
  const result = `${day}/${month}/${year}`;
  return result;
};
// ============================================================================

export const getDataFromFireStore = async (collectionName) => {
  const data = [];
  const querySnapshot = await db.collection(collectionName).get();

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export const getSingleDataFromFireStore = async (
  collectionName,
  documentName
) => {
  const docRef = await db.collection(collectionName).doc(documentName).get();

  let data;

  if (docRef.exists) {
    data = docRef.data();
  } else {
    console.log(
      `ERROR WHEN GET SINGLE DATA, collection: ${collectionName} document: ${documentName} `
    );
  }
  return data;
};

export const addDataToFireStore = (collectionName, documentName, data) => {
  db.collection(collectionName)
    .doc(documentName)
    .set(data, { merge: true })
    .catch((err) => {
      console.log(err);
    });
};

export const updateDataToFireStore = (collectionName, documentName, data) => {
  db.collection(collectionName)
    .doc(documentName)
    .set(data, { merge: true })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteDataInFireStore = (collectionName, documentName) => {
  db.collection(collectionName)
    .doc(documentName)
    .delete()
    .catch((err) => {
      console.log(err);
    });
};

export const deleteDataWithConditionInFireStore = async (
  collectionName,
  property,
  operation,
  object
) => {
  db.collection(collectionName)
    .where(property, operation, object)
    .get()
    .then((data) => {
      data.forEach((singleData) => {
        singleData.ref.delete();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const findDataFromFireStore = async (
  collectionName,
  property,
  operation,
  object
) => {
  const data = [];
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(property, operation, object)
      .get();
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const findRefDataFromFireStore = async (
  collectionName,
  property,
  operation,
  collectionObjectName,
  object
) => {
  const data = [];
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(
        property,
        operation,
        db.collection(collectionObjectName).doc(object)
      )
      .get();
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const increaseDebtOfUserInFireStore = (userID, debt) => {
  console.log("Updating debt");
  db.collection("Users")
    .doc(userID)
    .update({
      debt: firebase.firestore.FieldValue.increment(debt),
    })
    .then(() => console.log("Update debt!"))
    .catch((err) => console.log(err));
};

// =========================================================
export const getPaymentMethods = async (userID, dispatch) => {
  const paymentMethods = await findRefDataFromFireStore(
    "PaymentMethods",
    "userID",
    "==",
    "Users",
    userID
  );

  let newPayment = [];
  paymentMethods.map((el) => {
    const { id, note, number, type } = el;
    return newPayment.push({ id, note, number, type, userID });
  });

  dispatch(authAction.getPaymentMethodsFromFireStore(newPayment));
};

export const getMemberDatas = async (dispatch) => {
  let memberInListRaw = [];
  let memberInfoInListRaw = [];
  getDataFromFireStore("ListUser").then((data) => {
    memberInListRaw = data;
    const tmpList = [];
    Promise.all(
      data.map(async (el) => {
        const ref = el.userID.path;
        const [collectionName, documentName] = ref.split("/");
        const user = await getSingleDataFromFireStore(
          collectionName,
          documentName
        );
        tmpList.push(user);
      })
    ).then(() => {
      memberInfoInListRaw = tmpList;

      let memberInList = [];
      memberInListRaw.map((el) => {
        const { id, userID } = el;
        const uid = userID.path.split("/")[1];
        return memberInList.push({ id, uid });
      });

      let memberInfoInList = [];
      memberInfoInListRaw.map((el) => {
        const { debt, name, phone, role, userID } = el;
        return memberInfoInList.push({ debt, name, phone, role, userID });
      });

      dispatch(
        dataAction.updateMemberFromFireStore({
          memberInList,
          memberInfoInList,
        })
      );
    });
  });
};

export const deleteSingleMemberInListInStore = (id, dispatch) => {
  dispatch(dataAction.deleteSingleMemberInfoInList(id));
};

export const getAllUserInfo = async (dispatch) => {
  const allUser = await getDataFromFireStore("Users");
  dispatch(dataAction.getAllUserInfo(allUser));
};

export const changeNameOfUser = (userInfo, newName, dispatch) => {
  const userID = userInfo.userID;
  const newUserInfo = {
    ...userInfo,
    name: newName,
  };

  updateDataToFireStore("Users", userID, newUserInfo);
  dispatch(authAction.updateProfile(newName));
  dispatch(dataAction.updateNameOfUser({ userID, newName }));
};

export const addNewPaymentMethods = (paymentMethods, dispatch) => {
  dispatch(authAction.addPaymentMethods(paymentMethods));
};

export const deletePaymentMethods = (paymentMethods, dispatch) => {
  dispatch(authAction.deletePaymentMethods(paymentMethods));
};

export const updateMemberInStore = (
  memberInList,
  memberInfoInList,
  dispatch
) => {
  dispatch(
    dataAction.updateMemberFromFireStore({ memberInList, memberInfoInList })
  );
};

export const addMemberInStore = (
  newMembersInList,
  memberInfoInList,
  dispatch
) => {
  dispatch(dataAction.addMemberToStore({ newMembersInList, memberInfoInList }));
};

export const addUserDebtToStore = (userID, debt, dispatch) => {
  dispatch(dataAction.addDebtOfUser({ userID, debt }));
};

export const addUserInfoEachBillToStore = (newInfo, dispatch) => {
  const { id, bill, isPaid, monney, percent, user } = newInfo;
  const userID = user.path.split("/")[1];
  const billID = bill.path.split("/")[1];
  dispatch(
    authAction.addUserInfoEachBill({
      id,
      billID,
      isUserPaid: isPaid,
      yourPart: monney,
      percent,
      userID,
    })
  );
};

export const addRelatedBillToStore = (ownBillInfo, dispatch) => {
  const { id, billName, owner, createdDate, total, left, isBillPaid } =
    ownBillInfo;
  const ownerID = owner.path.split("/")[1];
  dispatch(
    authAction.addRelatedBill({
      id,
      billName,
      ownerID,
      createdDate,
      total,
      left,
      isBillPaid,
    })
  );
};

export const getRelatedBills = async (userID, dispatch) => {
  const listIDInUserOfBillRaw = await findDataFromFireStore(
    "ListUserOfBill",
    "user",
    "==",
    db.collection("Users").doc(userID)
  );
  const listIDInUserOfBill = [];
  listIDInUserOfBillRaw.map((el) => {
    const { id, bill, isPaid, monney, percent, user } = el;
    const userID = user.path.split("/")[1];
    const billID = bill.path.split("/")[1];
    return listIDInUserOfBill.push({
      id,
      billID,
      isUserPaid: isPaid,
      yourPart: monney,
      percent,
      userID,
    });
  });
  dispatch(authAction.getUserInfoEachBill(listIDInUserOfBill));
  const relatedBillsRaw = [];
  Promise.all(
    listIDInUserOfBill.map(async (item) => {
      const relatedBill = await findDataFromFireStore(
        "ListBill",
        "id",
        "==",
        item.billID
      );
      relatedBillsRaw.push(relatedBill);
    })
  ).then(() => {
    const relatedBills = [];
    relatedBillsRaw.map((el) => {
      const { id, billName, owner, createdDate, total, left, isBillPaid } = el[0];
      const ownerID = owner.path.split("/")[1];
      return relatedBills.push({
        id,
        billName,
        ownerID,
        createdDate,
        total,
        left,
        isBillPaid,
      });
    });
    dispatch(authAction.getRelatedBillsFromFireStore(relatedBills));
  });
};

export const editRelatedBillInStore = (billID, newBillInfo, dispatch) => {
  dispatch(authAction.editRelatedBill({ billID, newBillInfo }));
};

export const editUserInfoEachBillInStore = (id, newInfo, dispatch) => {
  dispatch(authAction.editUserInfoEachBill({ id, newInfo }));
};

export const editDebtOfLoginUserInStore = (debt, dispatch) => {
  dispatch(authAction.editDebt(debt));
};
