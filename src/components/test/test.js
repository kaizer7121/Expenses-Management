import { updateDataToFireStore } from "../../action/Action";
import { db } from "../../Firebase";

const Test = () => {
  const data = {
    userID: "NxriU8Nmc4evpu3KYTjjNpJHS1C2",
    phone: "user.phoneNumber",
    name: "",
    debt: 0,
    role: "User",
  };
  const updateDataToFireStore2 = (collectionName, documentName, data) => {
    db.collection("Users")
      .doc("NxriU8Nmc4evpu3KYTjjNpJHS1C2")
      .set(data, { merge: true })
      .catch((err) => {
        console.log(err);
      });
  };

  const click = () => {
    updateDataToFireStore2("Users", data, "NxriU8Nmc4evpu3KYTjjNpJHS1C2");
  };
  const Click2 = () => {
    db.collection("Users")
      .doc("NxriU8Nmc4evpu3KYTjjNpJHS1C2")
      .set(data, { merge: true })
      .catch((err) => {
        console.log(err);
      });
  };
  return <button onClick={click}>Button </button>;
};

export default Test;
