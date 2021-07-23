import { Fragment } from "react";
import Navigation from "../Layout/Navigation";
import PermissionNotification from "../Notification/PermissionNotification";

const Test = () => {
  return (
    <Fragment>
      <Navigation />
      <PermissionNotification />
    </Fragment>
  );
};

export default Test;
