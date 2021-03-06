import { useState } from "react";
import { useSelector } from "react-redux";
import classes from "./ProcessingButton.module.css";

const ProcessingButton = (props) => {
  const [action, setAction] = useState("Off");
  const [sortType, setSortType] = useState({
    sortDateType: 0,
    sortTotalType: 0,
  });
  const [filterType, setFilterType] = useState("All");
  const [optionFilter, setOptionFilter] = useState("");

  const userInfo = useSelector((state) => state.auth);

  const openSortOption = () => {
    if (action === "Sort") {
      setAction("Off");
    } else {
      setAction("Sort");
    }
  };

  const openFilterOption = () => {
    if (action === "Filter") {
      setAction("Off");
    } else {
      setAction("Filter");
    }
  };

  const sortHandler = (event) => {
    const type = event.target.id;
    let sortData = { ...sortType };
    if (type === "Date") {
      sortData = {
        sortDateType: (sortType.sortDateType % 2) + 1,
        sortTotalType: 0,
      };
    } else if (type === "Total") {
      sortData = {
        sortDateType: 0,
        sortTotalType: (sortType.sortTotalType % 2) + 1,
      };
    }
    setSortType({
      ...sortData,
    });
    props.onSort(sortData);
  };

  const chooseOptionFilter = (event) => {
    const option = event.target.id;
    if (optionFilter === option) {
      setOptionFilter("");
    } else {
      setOptionFilter(option);
    }
  };

  const filterHandler = (event) => {
    const type = event.target.id;
    if (type === "All") {
      setOptionFilter("");
    }
    setFilterType(type);
    props.onFilter(type, sortType);
  };

  const createBillHandler = () => {
    props.onOpen();
  };

  const sortOption = (
    <div className="flex justify-around font-semibold mt-4">
      <div>
        <span className="text-lg">Date</span>
        <div
          className="float-right cursor-pointer ml-2 pt-1.5"
          onClick={sortHandler}
        >
          <i
            id="Date"
            className={`fas fa-sort-up grid h-1 ${
              sortType.sortDateType === 2 ? "hidden" : ""
            }`}
          ></i>
          <i
            id="Date"
            className={`fas fa-sort-down grid h-1 ${
              sortType.sortDateType === 1 ? "hidden" : ""
            }`}
          ></i>
        </div>
      </div>
      <div>
        <span className="text-lg">Total</span>
        <div
          className="float-right cursor-pointer ml-2 pt-1.5"
          onClick={sortHandler}
        >
          <i
            id="Total"
            className={`fas fa-sort-up grid h-1 ${
              sortType.sortTotalType === 2 ? "hidden" : ""
            }`}
          ></i>
          <i
            id="Total"
            className={`fas fa-sort-down grid h-1 ${
              sortType.sortTotalType === 1 ? "hidden" : ""
            }`}
          ></i>
        </div>
      </div>
    </div>
  );

  const filterOption = (
    <div>
      <div className="flex justify-around font-semibold mt-4">
        <div
          id="All"
          className={`cursor-pointer ${
            filterType === "All" && "text-blue-600"
          }`}
          onClick={filterHandler}
        >
          All
        </div>
        <div
          id="User"
          className={`cursor-pointer ${
            optionFilter === "User" && "text-green-600"
          }`}
          onClick={chooseOptionFilter}
        >
          User
        </div>
        <div
          id="Bill"
          className={`cursor-pointer ${
            optionFilter === "Bill" && "text-green-600"
          }`}
          onClick={chooseOptionFilter}
        >
          Bill
        </div>
      </div>
      {optionFilter === "User" && (
        <div className="flex justify-around font-semibold mt-4">
          <div
            id="UserPaid"
            className={`cursor-pointer ${
              filterType === "UserPaid" && "text-blue-600"
            }`}
            onClick={filterHandler}
          >
            User Paid
          </div>
          <div
            id="UserUnpaid"
            className={`cursor-pointer ${
              filterType === "UserUnpaid" && "text-blue-600"
            }`}
            onClick={filterHandler}
          >
            User Unpaid
          </div>
        </div>
      )}
      {optionFilter === "Bill" && (
        <div className="flex justify-around font-semibold mt-4">
          <div
            id="OwnBill"
            className={`cursor-pointer ${
              filterType === "OwnBill" && "text-blue-600"
            }`}
            onClick={filterHandler}
          >
            Own Bill
          </div>
          <div
            id="PaidBill"
            className={`cursor-pointer ${
              filterType === "PaidBill" && "text-blue-600"
            }`}
            onClick={filterHandler}
          >
            Paid Bill
          </div>
          <div
            id="UnpaidBill"
            className={`cursor-pointer ${
              filterType === "UnpaidBill" && "text-blue-600"
            }`}
            onClick={filterHandler}
          >
            Unpaid Bill
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`${classes.layout} text-center w-11/12 sm:w-6/12 md:w-5/12 lg:w-4/12 2xl:w-3/12`}
    >
      <div className="justify-items-center mb-2 space-x-6">
        <button
          className={`${classes.sort_filter_button} px-3 rounded py-1 md:text-base lg:px-5`}
          onClick={openSortOption}
        >
          Sort
        </button>
        <button
          className={`${classes.add_bill_button} px-4 font-semibold rounded-lg py-1 text-lg md:text-base lg:text-xl xl:text-2xl`}
          onClick={createBillHandler}
        >
          Create a bill
        </button>
        <button
          className={`${classes.sort_filter_button} px-3 rounded py-1 md:text-base lg:px-5`}
          onClick={openFilterOption}
        >
          Filter
        </button>
      </div>
      {action === "Sort" && sortOption}
      {action === "Filter" && filterOption}
      <hr></hr>
      <div className={`text-right ${classes.total_price} font-semibold`}>
        Total left :{" "}
        {userInfo.debt.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    </div>
  );
};
export default ProcessingButton;
