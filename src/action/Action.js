import { db } from "../Firebase";

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
  console.log("convertedPhoneNumber: " + convertedPhoneNumber);
  return convertedPhoneNumber;
};

export const deconvertPhoneNumber = (convertedPhone) => {
  let deconvertedPhoneNumber = convertedPhone;
  if (deconvertedPhoneNumber.includes("+84", 0)) {
    deconvertedPhoneNumber = `0${deconvertedPhoneNumber.substring(3)}`;
  }
  return deconvertedPhoneNumber;
};

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
