import { Fragment } from "react";
import { useSelector } from "react-redux";
import { db } from "../../Firebase";
import Navigation from "../Layout/Navigation";
import PermissionNotification from "../Notification/PermissionNotification";

const Test = () => {
  const userInfo = useSelector((state) => state.auth);

  const checkListener = () => {
    db.collection("Users").onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type === "modified") {
          const modifiedUser = change.doc.data();
          console.log(modifiedUser);
          console.log("=================");
          console.log(userInfo);
          console.log("=================")
          if (userInfo.userID === modifiedUser.userID) {
            console.log("UPDATING");
          }
        }
      });
    });
  };

  checkListener();
  return (
    <Fragment>
      <p>checkListener:</p>
      <input type="text"></input>
    </Fragment>
  );
};

export default Test;
