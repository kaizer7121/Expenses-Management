import { forwardRef, useImperativeHandle } from "react";
import classes from "./ListBill.module.css";

const ListBill = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}));

  const setPaidColor = {
    backgroundColor: classes.background77ACF1,
    buttonColor: classes.buttonF0EBCC,
    textColor: classes.textBlack,
  };

  const setUnpaidColor2 = {
    backgroundColor: classes.background1EAE98,
    buttonColor: classes.buttonFFFFC7,
    textColor: classes.textBlack,
  };

  const removeCard = () => {
    // props.removePayment(props.number);
  };

  return (
    <div className="grid justify-items-center grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-2 sm:mt-6 md:mt-12 2xl:mt-18">
      {props.bills.map((el) => {
        const cardColor = el.isPaid ? setPaidColor : setUnpaidColor2;
        return (
          <div className="max-w-md inline-flex items-center justify-center w-full mb-8 md:mb-12 lg:mb-16">
            <div
              className={`w-11/12 md:w-full mt-4 ${cardColor.backgroundColor} rounded-lg`}
            >
              <div className="w-full mb-4">
                <p className="appearance-none w-full py-2 px-4 leading-tight font-bold text-left text-2xl  md:text-3xl xl:text-3xl ">
                  {`${el.billName} (${el.createdDate}) ${
                    el.isPaid ? "(paid)" : ""
                  }`}
                  {/* Electricity bill (7/2021) (paid) */}
                </p>
              </div>
              <div className="sm:w-3/4">
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left">
                  {`Total: 
                  ${el.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}`}
                </p>
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left">
                  {`Left: 
                  ${el.left.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}`}
                </p>
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left float-left">
                  {`Your part: 
                  ${el.yourPart.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  ${el.isPaid ? "(paid)" : ""} `}
                </p>
              </div>

              <div className="text-right mr-4 pb-4">
                <button
                  className={`shadow ${cardColor.buttonColor} ${cardColor.buttonHoverColor} focus:shadow-outline focus:outline-none ${cardColor.textColor} font-semibold py-2 px-5 rounded`}
                  type="button"
                  //   onClick={removeCard}
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ListBill;
