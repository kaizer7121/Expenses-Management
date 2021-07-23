import { Fragment } from "react";
import Navigation from "../components/Layout/Navigation";
import PermissionNotification from "../components/Notification/PermissionNotification";

const Notification = () => {
  return (
    <Fragment>
      <Navigation />
      <PermissionNotification />
    </Fragment>
  );
};

export default Notification;
