import { useState } from "react";
import classes from "./ProcessingButton.module.css";

const ProcessingButton = () => {
  const [action, setAction] = useState("Off");

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
  const sort = (
    <div className="flex justify-around font-semibold mt-4">
      <div>
        <span className="text-lg">Date</span>
        <div
          className="float-right cursor-pointer ml-2 mt-1 -space-y-3 sm:-space-y-3 md:-space-y-3"
          // onClick={sortHandler}
        >
          <i id="date" className={`fas fa-sort-up flex`}></i>
          <i id="date" className={`fas fa-sort-down flex`}></i>
        </div>
      </div>
      <div>
        <span className="text-lg">Total</span>
        <div
          className="float-right cursor-pointer ml-2 mt-1 -space-y-3 sm:-space-y-3 md:-space-y-3"
          // onClick={sortHandler}
        >
          <i id="total" className={`fas fa-sort-up flex`}></i>
          <i id="total" className={`fas fa-sort-down flex`}></i>
        </div>
      </div>
    </div>
  );

  const filter = (
    <div className="flex justify-around font-semibold mt-4">
      <div className="cursor-pointer text-blue-600">All</div>
      <div className="cursor-pointer">Paid</div>
      <div className="cursor-pointer">Unpaid</div>
    </div>
  );

  return (
    <div
      className={`${classes.layout} text-center w-11/12 sm:w-6/12 md:w-5/12 lg:w-4/12 xl:w-3/12 2xl:w-3/12`}
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
          // onClick={addHandler}
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
      {action === "Sort" && sort}
      {action === "Filter" && filter}
      <hr></hr>
      <div className={`text-right ${classes.total_price} font-semibold`}>
        Total left : 100.000  VND
      </div>
    </div>
  );
};
export default ProcessingButton;
