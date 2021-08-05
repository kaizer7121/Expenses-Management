import { Fragment } from "react";
import { useSelector } from "react-redux";
import { db } from "../../Firebase";
import Navigation from "../Layout/Navigation";
import PermissionNotification from "../Notification/PermissionNotification";

const Test = () => {
  const userInfo = useSelector((state) => state.auth);

  
  db.collection("SecretCode").doc("SecretCode")
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data().secretCode);
    });
  
  return (
    <Fragment>
      <p>checkListener:</p>
      <input type="text"></input>
    </Fragment>
  );
};

export default Test;
