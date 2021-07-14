import { Fragment } from "react";
import ListBill from "./ListBill";
import ProcessingButton from "./ProcessingButton";

const DUMMY_DATA = [
  {
    billName: "Electricity bill",
    createdDate: "7/2021",
    total: 500000,
    left: 400000,
    yourPart: 100000,
    isPaid: true,
  },
  {
    billName: "Water bill",
    createdDate: "6/2021",
    total: 250000,
    left: 200000,
    yourPart: 120000,
    isPaid: false,
  },
  {
    billName: "Wifi bill",
    createdDate: "4/2021",
    total: 100000,
    left: 100000,
    yourPart: 50000,
    isPaid: false,
  },
  {
    billName: "Wifi bill",
    createdDate: "4/2021",
    total: 100000,
    left: 100000,
    yourPart: 50000,
    isPaid: false,
  },
  {
    billName: "Electricity bill",
    createdDate: "7/2021",
    total: 500000,
    left: 400000,
    yourPart: 100000,
    isPaid: true,
  },
];

const BillManagement = () => {
  return (
    <Fragment>
      <ProcessingButton />
      <ListBill bills={DUMMY_DATA} />
    </Fragment>
  );
};

export default BillManagement;
