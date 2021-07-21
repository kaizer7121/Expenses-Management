import { Fragment } from "react";
import Backdrop from "./Backdrop/Backdrop";
import classes from "./UserPaymentMethods.module.css";

const UserPaymentMethods = (props) => {
  const setColor1 = {
    backgroundColor: classes.background1EAE98,
    buttonColor: classes.buttonF0EBCC,
    textColor: classes.textBlack,
  };

  const setColor2 = {
    backgroundColor: classes.backgroundF0EBCC,
    buttonColor: classes.button2563EB,
    textColor: classes.textWhite,
  };

  const backToDetailHandler = () => {
    props.backToDetail();
  };

  const closeHandler = () => {
    props.onClose();
  };

  return (
    <Fragment>
      <Backdrop />
      <div
        className={`${classes.modal} p-4 overflow-auto max-h-85% sm:px-8 md:p-8 lg:p-10`}
      >
        <div className="mb-6 text-center sm:mb-6 md:-mt-4">
          <h1 className="inline font-bold text-blue-900 pl-5 text-3xl sm:text-4xl lg:text-5xl">
            Payment Methods
          </h1>
          <img
            src="images/cancel.png"
            alt="Cancel icon"
            className="inline w-5 float-right cursor-pointer"
            onClick={closeHandler}
          />
          <hr className="border-t-2 border-gray-400 mt-4 inline-block w-full mb-4 md:mb-6"></hr>

          <div className="overflow-auto max-h-132 ">
            {props.billPaymentsInfo.map((el, index) => {
              const cardColor = index % 2 === 0 ? setColor1 : setColor2;
              return (
                <div className="max-w-md lg:max-w-lg inline-flex items-center justify-center w-full mb-6">
                  <div
                    className={`w-full min-h-small mt-4 md:min-h-large inline-block ${cardColor.backgroundColor}`}
                  >
                    <div className="w-full">
                      <p className="appearance-none w-full py-2 px-4 leading-tight text-3xl font-bold text-left lg:text-4xl lg:py-3">
                        {el.type}
                      </p>
                    </div>
                    <input
                      className={`${cardColor.backgroundColor} appearance-none w-full py-2 px-4 leading-tight focus:outline-none text-2xl sm:text-3xl font-bold lg:text-4xl lg:py-3`}
                      type="text"
                      value={el.number}
                      onChange={() => {}}
                    />
                    <p className="appearance-none w-full py-2 px-4 leading-tight text-lg text-left lg:text-xl lg:py-3">
                      {el.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center  mt-8 sm:mt-12 sm:px-8">
            <button
              className={`${classes.back_button} text-white font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
              onClick={backToDetailHandler}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserPaymentMethods;
