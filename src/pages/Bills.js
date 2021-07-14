import { Fragment } from "react";
import BillManagement from "../components/BillManagement/BillManagement";
import Navigation from "../components/Layout/Navigation";

const Bills = () => {
  return (
    <Fragment>
      <Navigation />
      <BillManagement />
    </Fragment>
  );
};

export default Bills;
