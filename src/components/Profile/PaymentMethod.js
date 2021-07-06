import "./PaymentMethod.css";

const PaymentMethod = (props) => {
  const setColor1 = {
    backgroundColor: "background-1EAE98",
    buttonColor: "button-F0EBCC",
    textColor: "text-black",
  };

  const setColor2 = {
    backgroundColor: "background-F0EBCC",
    buttonColor: "button-2563EB",
    textColor: "text-white",
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
