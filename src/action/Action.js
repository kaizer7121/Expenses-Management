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

export const addDataToFireStore = (collectionName, data) => {
  const uniqueID = randomString(15);
  db.collection(collectionName)
    .doc(uniqueID)
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
  collectionObjectName
  ,object
) => {
  const data = [];
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(property, operation, db.collection(collectionObjectName).doc(object))
      .get();
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
