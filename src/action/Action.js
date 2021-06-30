import { db } from "../Firebase";

export const randomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getDataFromFireStore = async (collectionName) => {
  const data = [];
  await db
    .collection(collectionName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
    });

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

export const UpdateDataToFireStore = (collectionName, data, documentName) => {
  db.collection(collectionName)
    .doc(documentName)
    .set(data, { merge: true })
    .catch((err) => {
      console.log(err);
    });
};
