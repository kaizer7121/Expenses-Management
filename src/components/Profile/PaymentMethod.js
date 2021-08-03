import classes from "./PaymentMethod.module.css";

const PaymentMethod = (props) => {
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

  const removeCard = () => {
    props.removePayment(props.number);
  };

  const cardColor = props.number % 4 < 2 ? setColor1 : setColor2;

  return (
    <div className="max-w-sm inline-flex items-center justify-center w-full mb-6 sm:max-w-md lg:pr-4 xl:pr-8 lg:max-w-lg ">
      <div className={`w-full min-h-small mt-4 md:min-h-large inline-block ${cardColor.backgroundColor}`}>
        <div className="w-full">
          <p className="appearance-none w-full py-2 px-4 leading-tight text-2xl font-bold text-left sm:text-3xl">
            {props.data.type}
          </p>
        </div>
        <div className="w-full">
          <p className="appearance-none w-full py-2 px-4 leading-tight text-2xl font-bold text-left sm:text-3xl">
            {props.data.number}
          </p>
        </div>
        <p className="appearance-none w-full py-2 px-4 leading-tight text-base text-left sm:text-lg">
          {props.data.note}
        </p>
        <div className="text-right mr-4 pb-4">
          <button
            className={`shadow ${cardColor.buttonColor} ${cardColor.buttonHoverColor} focus:shadow-outline focus:outline-none ${cardColor.textColor} font-bold py-2 px-5 rounded`}
            type="button"
            onClick={removeCard}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
