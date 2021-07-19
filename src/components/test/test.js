import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import CreateBill from "../Popup/CreateBill";
import "react-day-picker/lib/style.css";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { updateDataToFireStore } from "../../action/Action";
import BillDetail from "../Popup/BillDetail";

const Test = () => {
  return (
    <Fragment>
      <BillDetail />
    </Fragment>
  );
};

export default Test;
