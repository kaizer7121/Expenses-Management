import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import CreateBill from "../Popup/CreateBill";
import "react-day-picker/lib/style.css";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { updateDataToFireStore } from "../../action/Action";
import BillDetail from "../Popup/BillDetail";
import UserPaymentMethods from "../Popup/UserPaymentMethods";

const Test = () => {
  let circleCommonClasses = "h-2.5 w-2.5 bg-current rounded-full";

  return (
    <div className="flex">
      <button type="button" class="bg-rose-600 ..." disabled>
        <img
          src="images/Rolling-1s-51px.png"
          alt="loading"
          className="animate-spin h-5 w-5 mr-3"
        />
        Processing
      </button>
    </div>
  );
};

export default Test;
