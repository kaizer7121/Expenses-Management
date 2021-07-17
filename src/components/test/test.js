import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import CreateBill from "../Popup/CreateBill";
import "react-day-picker/lib/style.css";
import { useSelector } from "react-redux";

const Test = () => {
  const allUserInfo = useSelector((state) => state.data.allUserInfo);
  const listUserInBill = [];
  allUserInfo.map((el) => {
    const userInBill = {
      id: el.id,
      name: el.name,
      phone: el.phone,
      monney: 0,
      percent: 0,
      select: false,
    };
    return listUserInBill.push(userInBill);
  });

  return <CreateBill listUserInBill={listUserInBill} />;
};

export default Test;
