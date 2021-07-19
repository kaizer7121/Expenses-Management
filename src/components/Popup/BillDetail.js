import { Fragment } from "react";
import Backdrop from "./Backdrop/Backdrop";
import classes from "./BillDetail.module.css";

const BillDetail = () => {
  return (
    <Fragment>
      <Backdrop />
      <div
        className={`${classes.modal} p-4 overflow-auto max-h-full sm:px-8 md:p-8 lg:p-10`}
      >
        <div className="mb-6 text-center sm:mb-12">
          <h1 className="inline font-bold pl-5 text-2xl sm:text-3xl lg:text-4xl">
            ELECTRICITY BILL
          </h1>
          <img
            src="images/cancel.png"
            alt="Cancel icon"
            className="inline w-5 float-right cursor-pointer"
            //   onClick={cancelHandler}
          />
          <p className="test-base mt-0 md:mt-2 md:text-lg md:font-medium">
            Created date: 2/7/2021
          </p>
          <hr className="border-gray-300 w-1/2 mb-4 md:mb-6"></hr>
        </div>
        <div className="mb-6 font-medium text-sm sm:mb-10 sm:text-lg md:text-lg">
          <p>Owner: Đào Hữu Đức</p>
        </div>
        <div className="mb-4 font-medium text-sm sm:text-lg sm:mb-2 md:text-lg">
          <p>List people have to pay: </p>
        </div>
        <div className="overflow-auto max-h-64 md:max-h-72 lg:max-h-80 xl:max-h-96">
          <table className="table-fixed border-collapse text-center mb-4 sm:mt-6 sm:mb-6 md:mb-8">
            <thead>
              <tr>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 md:text-xl">
                  <div>Name</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 md:text-xl">
                  <div>Phone</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 md:text-xl">
                  <div>Money</div>
                </th>
                <th className="border-b border-black text-sm w-1/12 pb-2 sm:text-lg sm:pb-4 md:pb-8 md:text-xl md:w-2/12">
                  <div>Paid</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-6">
                  {/* {el.name} */}
                  Dao Huu Duc
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-6">
                  {/* {deconvertPhoneNumber(el.phone)}
                   */}
                  0703431760
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-6">
                  {/* {el.monney.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })} */}
                  500.000VND
                </td>
                <td className="border-b border-black py-1 lg:py-6">
                  <label className="inline-flex items-center mt-2">
                    <input
                      // id={el.id}
                      type="checkbox"
                      className="form-checkbox h-4 w-4  md:h-5 md:w-5"
                      // checked={el.select}
                      // onChange={changePaticipantHandler}
                    />
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between">
            <div className="text-sm sm:text-base md:text-lg font-semibold">Payment Methods (4)</div>
            <div className="text-sm sm:text-base md:text-lg">Left: 500.000VND</div>
          </div>
        </div>
        <div className="flex justify-around mt-8 sm:justify-between sm:mt-12 sm:px-8">
          <button
            className={`${classes.close_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
            // onClick={cancelHandler}
          >
            Edit
          </button>
          <button
            className={`${classes.save_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
            // onClick={saveHandler}
          >
            Save
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default BillDetail;
