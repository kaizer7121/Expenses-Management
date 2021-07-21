import { Fragment } from "react";

import ManageMember from "../components/ManageMember/ManageMember";
import Navigation from "../components/Layout/Navigation";

const Members = () => {
  return (
    <Fragment>
      <Navigation />
      <ManageMember />
    </Fragment>
  );
};

export default Members;
