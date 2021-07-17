import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import CreateBill from "../Popup/CreateBill";
import "react-day-picker/lib/style.css";
import { useSelector } from "react-redux";

const DUMMY_DATA = [
  { id: "1", debt: 0, name: "Hữu Đức", phone: "+84703431760" },
  { id: "2", debt: 0, name: "Đức", phone: "+84123456787" },
  { id: "3", debt: 0, name: "Test", phone: "+84123456788" },
  { id: "4", debt: 0, name: "Đào Hữu Đức", phone: "+84123456789" },
];

const Test = () => {
  // const allUserInfo = useSelector((state) => state.data.allUserInfo);
  const listUserInBill = [];
  DUMMY_DATA.map((el) => {
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
