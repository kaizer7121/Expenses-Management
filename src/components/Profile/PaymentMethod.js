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
    <div className="max-w-md inline-flex items-center justify-center">
      <div className={`md:w-full mt-4 ${cardColor.backgroundColor}`}>
        <div className="w-full">
          <p className="appearance-none w-full py-2 px-4 leading-tight text-3xl font-bold text-left">
            {props.data.type}
          </p>
        </div>
        <input
          className={`${cardColor.backgroundColor} appearance-none w-full py-2 px-4 leading-tight focus:outline-none text-3xl font-bold`}
          type="text"
          value={props.data.number}
          onChange={() => {}}
        />
        <p className="appearance-none w-full py-2 px-4 leading-tight text-lg text-left">
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
