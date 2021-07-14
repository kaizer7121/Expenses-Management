import { useState, Fragment } from "react";
import { convertPhoneNumber, deconvertPhoneNumber } from "../../action/Action";
import classes from "./AddMember.module.css";
import Backdrop from "./Backdrop/Backdrop";

const AddMember = (props) => {
  const [selectedValue, setSelectedValue] = useState("default");
  const [value, setValue] = useState({
    name: "empty",
    phone: "empty",
  });
  const [isSelect, setIsSelect] = useState(false);
  const [notification, setNotification] = useState();

  const selectUserHandler = (event) => {
    const target = event.target.value;
    setSelectedValue(target);
    const splitTarget = target.split(" - ");
    setIsSelect(true);
    setValue({
      name: splitTarget[0],
      phone: splitTarget[1],
    });
  };

  const cancelHandler = () => {
    props.onClose();
  };

  const addHandler = () => {
    if (!isSelect) {
      setNotification("You can't add an empty user");
    } else {
      props.onAdd(convertPhoneNumber(value.phone), value.name);
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className={`${classes.modal}`}>
        <div className="m-auto bg-gray-50 rounded-lg">
          <div className="font-bold text-center py-4 text-2xl mb-4 lg:text-3xl lg:mb-6">
            <p>Select user to add</p>
          </div>
          <div className="relative inline-block w-full text-gray-600 text-center text-sm mb-1 lg:mb-2">
            <select
              className="w-9/12 md:w-8/12 h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
              placeholder="Regular input"
              value={selectedValue}
              onChange={selectUserHandler}
            >
              <option value="default" disabled hidden>
                Choose user
              </option>
              {props.listUser.map((el) => {
                return (
                  <option key={el.userID} className="text-sm">
                    {`${el.name} - ${deconvertPhoneNumber(el.phone)}`}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="text-center pt-4 pb-3 sm:pt-5 sm:pb-4 mb-1 lg:mb-2 space-y-1">
            <p className="sm:mr-2 sm:inline">
              Name:{" "}
              <span className={!isSelect ? "text-gray-400" : ""}>
                {value.name}
              </span>
            </p>
            <p className="sm:ml-2  sm:inline">
              Phone:{" "}
              <span className={!isSelect ? "text-gray-400" : ""}>
                {value.phone}
              </span>
            </p>
          </div>
          <div className="text-center mb-4 lg:mb-6 text-red-500">
            <p>{notification}</p>
          </div>
          <div className="text-center space-x-20 pb-6">
            <button
              className={`${classes.cancelButton} w-3/12 font-semibold rounded-lg py-2 sm:py-2 text-lg md:py-2 md:text-base lg:text-lg xl:text-xl`}
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button
              className={`${classes.addButton} w-3/12 font-semibold rounded-lg py-2 sm:py-2 text-lg md:py-2 md:text-base lg:text-lg xl:text-xl`}
              onClick={addHandler}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddMember;
