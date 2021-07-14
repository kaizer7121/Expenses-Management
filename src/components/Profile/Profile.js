import { useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import PaymentMethod from "./PaymentMethod";
import {
  addNewPaymentMethods,
  changeNameOfUser,
  deconvertPhoneNumber,
  deleteDataInFireStore,
  deletePaymentMethods,
  randomString,
  updateDataToFireStore,
} from "../../action/Action";
import { db } from "../../Firebase";

import classes from "./Profile.module.css";

const Profile = (props) => {
  const userInfo = useSelector((state) => state.auth);
  const [infoPayment, setInfoPayment] = useState({
    type: "",
    number: "",
    note: "",
  });
  const [name, setName] = useState("");
  const [paymentInfos, setPaymentInfos] = useState([...props.paymentInfos]);
  const [backupPaymentInfos, setBackupPaymentInfos] = useState([
    ...paymentInfos,
  ]);
  const [newPayment, setNewPayment] = useState([]);
  const [deletedPayments, setDeletedPayments] = useState([]);
  const [notification, setNotifictation] = useState({
    paymentErr: "",
    nameErr: "",
  });
  const [isChange, setIsChange] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setName(userInfo.name);
  }, [userInfo.name]);

  const changeNameHander = (event) => {
    setIsChange(true);
    setName(event.target.value);
    setNotifictation({
      paymentErr: "",
      nameErr: "",
    });
  };

  const changeValueHander = (event) => {
    const type = event.target.id;
    if (event.target.value.length === 0) {
      setInfoPayment((prevValue) => {
        return { ...prevValue, [type]: "" };
      });
    } else {
      setInfoPayment((prevValue) => {
        return { ...prevValue, [type]: event.target.value };
      });
    }
    setNotifictation({
      paymentErr: "",
      nameErr: "",
    });
  };

  const changingNoteOfInfo = () => {
    if (infoPayment.note && infoPayment.note.includes("Note: ")) {
      const temp = infoPayment.note.split("Note: ");
      setInfoPayment({
        type: infoPayment.type,
        number: infoPayment.number,
        note: temp[1],
      });
    }
  };

  const changedNoteOfInfo = () => {
    if (infoPayment.note && !infoPayment.note.includes("Note: ")) {
      setInfoPayment({
        type: infoPayment.type,
        number: infoPayment.number,
        note: `Note: ${infoPayment.note}`,
      });
    }
  };

  const addNewPayment = () => {
    const { type, number, note } = infoPayment;
    if (type && number && note) {
      if (type.length !== 0 && number.length !== 0 && note.length !== 0) {
        const newPaymentInfo = {
          id: randomString(20),
          type: infoPayment.type,
          number: infoPayment.number,
          note: infoPayment.note,
          userID: db.collection("Users").doc(userInfo.userID),
        };
        setPaymentInfos((prevValue) => {
          return [...prevValue, newPaymentInfo];
        });
        setNewPayment((prevValue) => {
          return [...prevValue, newPaymentInfo];
        });
        setInfoPayment({
          type: "",
          number: "",
          note: "",
        });
        setIsChange(true);
      }
    } else {
      setNotifictation((prevValue) => {
        return { ...prevValue, paymentErr: "Not let any data is empty!" };
      });
    }
  };

  const removePayment = (index) => {
    const deletedPayment = paymentInfos[index];
    const checkInNewPayment = newPayment.find((el) => {
      return el.id === deletedPayment.id;
    });
    if (checkInNewPayment) {
      const tempNewPayment = newPayment.filter((el) => {
        return el.id !== deletedPayment.id;
      });
      setNewPayment([...tempNewPayment]);
    } else {
      setDeletedPayments((prevValue) => [...prevValue, deletedPayment]);
    }

    let newPaymentInfos = [...paymentInfos];
    newPaymentInfos.splice(index, 1);
    setPaymentInfos([...newPaymentInfos]);
    setIsChange(true);
  };

  const resetDataHandler = () => {
    setPaymentInfos([...backupPaymentInfos]);
    setNewPayment([]);
    setDeletedPayments([]);
    setIsChange(false);
  };

  const saveDataHandler = () => {
    if (isChange) {
      addNewPaymentMethods(newPayment, dispatch);
      if (newPayment.length !== 0) {
        newPayment.map((el) => {
          return updateDataToFireStore("PaymentMethods", el.id, el);
        });
      }
      if (deletedPayments.length !== 0) {
        deletePaymentMethods(deletedPayments, dispatch);
        deletedPayments.map((el) => {
          return deleteDataInFireStore("PaymentMethods", el.id);
        });
      }
      setBackupPaymentInfos([...paymentInfos]);
      setIsChange(false);
    }
    if (name.length === 0) {
      setNotifictation((prevValue) => {
        return { ...prevValue, nameErr: "Your name must be empty!" };
      });
    } else {
      if (userInfo.name !== name) {
        changeNameOfUser(userInfo, name, dispatch);
      }
      history.push("/");
    }
  };

  return (
    <Fragment>
      <div className="py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold">Your User Profile</h1>
              <p className="text-red-600 text-lg lg:text-xl">
                {notification.paymentErr}
              </p>
            </div>

            <div className="pt-4 space-x-4">
              <h2 className="font-semibold inline-block text-lg">
                Phone number:
              </h2>
              <p className="inline-block py-2 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm md:text-xl">
                {deconvertPhoneNumber(userInfo.phone)}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-semibold">Name*:</p>
              <input
                name="verificationCode"
                type="text"
                value={name}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 
              rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm lg:text-lg"
                onChange={changeNameHander}
              />
            </div>
            <p className="text-red-600 text-lg lg:text-xl">
              {notification.nameErr}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-xl font-semibold">Add New Payment Method:</p>
            <div className="md:w-full mt-4 bg-gray-100">
              <input
                autoComplete="off"
                className={`bg-gray-100 appearance-none border-2 border-gray-100 w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
                  infoPayment.type && "text-3xl font-bold"
                }`}
                id="type"
                type="text"
                placeholder="Type(Momo, viettelpay, Agribank,...)"
                onChange={changeValueHander}
                value={infoPayment.type}
              />
              <input
                autoComplete="off"
                className={`bg-gray-100 appearance-none border-2 border-gray-100 w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
                  infoPayment.number && "text-2xl md:text-3xl font-bold"
                }`}
                id="number"
                type="text"
                placeholder="Number (bank number, phone)"
                onChange={changeValueHander}
                value={infoPayment.number}
              />
              <textarea
                className={`bg-gray-100 appearance-none border-2 border-gray-100 w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
                  infoPayment.note && "text-lg"
                }`}
                rows="1"
                id="note"
                type="text"
                placeholder="Note"
                onChange={changeValueHander}
                onFocus={changingNoteOfInfo}
                onBlur={changedNoteOfInfo}
                value={infoPayment.note}
              />
              <div className="text-right mr-4 pb-4">
                <button
                  className="shadow bg-green-500 hover:bg-green-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-7 rounded"
                  type="button"
                  onClick={addNewPayment}
                >
                  ADD
                </button>
              </div>
            </div>
            <p className="text-red-600 text-lg lg:text-xl">
              {notification.paymentErr}
            </p>
          </div>
        </div>
      </div>
      <div className="py-8 text-center md:px-16">
        <p className="text-2xl font-semibold mb-4 lg:text-3xl xl:mb-8">
          Your payment methods
        </p>
        <div className="flex justify-center grid grid-cols-1 lg:grid-cols-2 2xl:px-72 text-center">
          {paymentInfos.map((el, index) => {
            return (
              <div key={el.id} className="mb-4 2xl:mb-8">
                <PaymentMethod
                  data={el}
                  number={index}
                  removePayment={removePayment}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center space-x-28 pr-4 sm:space-x-12 sm:pr-10 md:space-x-16 md:mt-8 lg:pr-14 xl:space-x-48 xl:mt-12 md:pl-12">
        <button
          className={`${classes.resetButton} font-semibold rounded-lg py-2 px-6 sm:py-2 sm:px-8 md:px-9 md:py-3 text-2xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl`}
          onClick={resetDataHandler}
        >
          Reset
        </button>
        <button
          className={`${classes.saveButton} font-semibold rounded-lg py-2 px-6 sm:py-2 sm:px-8 md:px-9 md:py-3 text-2xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl`}
          onClick={saveDataHandler}
        >
          Save
        </button>
      </div>
    </Fragment>
  );
};

export default Profile;
