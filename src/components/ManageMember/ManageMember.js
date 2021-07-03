import { useState } from "react";
import { useSelector } from "react-redux";
import {
  findDataFromFireStore,
  randomString,
  updateDataToFireStore,
} from "../../action/Action";
import { db } from "../../Firebase";

import "./ManageMember.css";

const ManageMember = (props) => {
  const [usersInfo, setUsersInfo] = useState([...props.usersInfo]);
  const [listUser, setListUser] = useState([...props.listUser]);
  const [backupArray, setBackupArray] = useState({
    usersInfo: [...usersInfo],
    listUser: [...listUser],
  });
  const [{ inputNickname, inputPhone }, setInputValue] = useState({
    inputNickname: "",
    inputPhone: "",
  });
  const [notification, setNotification] = useState("");
  const [arrayIsChange, setArrayIsChange] = useState(false);

  const loginUserInfo = useSelector((state) => state.auth);

  const changeNickNameHandler = (event) => {
    const targetedId = event.target.name;
    const targetedContent = event.target.value;
    setListUser((prevValue) => {
      const selectedIndex = prevValue.findIndex((el) => el.id === targetedId);
      const selectedObject = prevValue[selectedIndex];
      prevValue[selectedIndex] = {
        ...selectedObject,
        nickname: targetedContent,
      };
      return [...prevValue];
    });
  };

  const removeUserHandler = (event) => {
    const targetedId = event.target.name;
    let selectedIndex = -1;
    setListUser((prevValue) => {
      selectedIndex = prevValue.findIndex((el) => el.id === targetedId);
      prevValue.splice(selectedIndex, 1);
      return [...prevValue];
    });
    setUsersInfo((prevValue) => {
      prevValue.splice(selectedIndex, 1);
      return [...prevValue];
    });
  };

  const inputValueHandler = (event) => {
    const type = event.target.name;
    const content = event.target.value;
    setInputValue((prevValue) => {
      return { ...prevValue, [type]: content };
    });
    setNotification("");
  };

  const convertPhoneNumber = (phoneNum) => {
    let convertedPhoneNumber = phoneNum;
    if (convertedPhoneNumber.charAt(0) === "0") {
      convertedPhoneNumber = convertedPhoneNumber.substring(1);
    }
    if (convertedPhoneNumber.includes("+840")) {
      convertedPhoneNumber = convertedPhoneNumber.substring(4);
    }
    if (!convertedPhoneNumber.includes("+84", 0)) {
      convertedPhoneNumber = `+84${convertedPhoneNumber}`;
    }
    console.log("convertedPhoneNumber: " + convertedPhoneNumber);
    return convertedPhoneNumber;
  };

  const deconvertPhoneNumber = (convertedPhone) => {
    let deconvertedPhoneNumber = convertedPhone;
    if (deconvertedPhoneNumber.includes("+84", 0)) {
      deconvertedPhoneNumber = `0${deconvertedPhoneNumber.substring(3)}`;
    }
    return deconvertedPhoneNumber;
  };

  const addUserHandler = async () => {
    const convertedPhone = convertPhoneNumber(inputPhone);
    const checkUserIsExisted = usersInfo.find((el, index) => {
      console.log(`el: ${el.phone}    converted: ${convertedPhone}`);
      return el.phone === convertedPhone;
    });
    console.log("checkUserIsExisted: " + checkUserIsExisted);
    if (inputNickname.length === 0 || convertedPhone.length === 0) {
      setNotification("Name and phone must not be empty");
    } else if (checkUserIsExisted) {
      setNotification("This phone number is already added!");
      setInputValue({ inputNickname: "", inputPhone: "" });
    } else {
      const user = await findDataFromFireStore(
        "Users",
        "phone",
        "==",
        convertedPhone
      );
      if (user && user.length === 1) {
        const newUserInList = {
          id: randomString(15),
          nickname: inputNickname,
          userID: db.collection("Users").doc(user[0].userID),
        };
        setListUser((prevValue) => {
          return [...prevValue, newUserInList];
        });
        setUsersInfo((prevValue) => {
          return [...prevValue, ...user];
        });
        setInputValue({ inputNickname: "", inputPhone : "" });
        setArrayIsChange(true);
      } else {
        setNotification("The phone number is not created!");
      }
    }
  };

  const resetDataHandler = () => {
    setUsersInfo([...backupArray.usersInfo]);
    setListUser([...backupArray.listUser]);
    setArrayIsChange(false);
  };

  const saveDataHandler = () => {
    if (arrayIsChange) {
      console.log(listUser);
      setBackupArray(usersInfo);
      listUser.map((el) => {
        return updateDataToFireStore("ListUser", el.id, el);
      });
    }
  };

  return (
    <div>
      <div className="mt-12 lg:mt-16 text-center w-full text-2xl font-semibold mb-20 sm:text-4xl md:w-3/12 md:border-b md:text-left md:text-3xl md:4/12 lg:text-4xl lg:mx-16 lg:w-3/12 2xl:w-2/12">
        <h1>List member</h1>
      </div>
      <table className="table-fixed border-collapse text-center lg:mx-16">
        <thead>
          <tr>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Nickname</div>
            </th>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Phone</div>
            </th>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Debt</div>
            </th>
            <th className="border-b border-black text-base w-1/12 sm:w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {usersInfo.map((el, index) => {
            return (
              <tr key={el.userID}>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl self-center py-2 lg:py-8">
                  {loginUserInfo.role === "Admin" ||
                  loginUserInfo.userID === el.userID ? (
                    <textarea
                      rows="1"
                      onChange={changeNickNameHandler}
                      name={listUser[index].id}
                      className="text-center w-full resize-y"
                      value={listUser[index].nickname}
                    />
                  ) : (
                    <textarea
                      rows="1"
                      onChange={changeNickNameHandler}
                      name={listUser[index].id}
                      className="text-center w-full resize-y"
                      value={listUser[index].nickname}
                      readOnly
                    />
                  )}
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                  {/* <input
                    onChange={changeValueHandler}
                    id={el.userID}
                    name={`phone ${el.userID}`}
                    className="text-center w-full"
                    value={usersInfo[index].phone}
                  /> */}
                  {deconvertPhoneNumber(el.phone)}
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                  {el.debt.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td className="border-b border-black py-2 lg:py-4">
                  {loginUserInfo.role === "Admin" ? (
                    <img
                      name={listUser[index].id}
                      className="mx-auto h-5 sm:h-8 md:h-10 m-4 cursor-pointer"
                      src="images/cancel.png"
                      alt="Workflow"
                      onClick={removeUserHandler}
                    />
                  ) : (
                    <img
                      name={listUser[index].id}
                      className="mx-auto h-5 sm:h-8 md:h-10 m-4 cursor-not-allowed"
                      src="images/cancel.png"
                      alt="Workflow"
                    />
                  )}
                </td>
              </tr>
            );
          })}
          {loginUserInfo.role === "Admin" && (
            <tr>
              <td className="text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                <textarea
                  rows="1"
                  name="inputNickname"
                  className="placeholder-gray-500 text-center w-full"
                  placeholder="Nickname (required)"
                  value={inputNickname}
                  onChange={inputValueHandler}
                />
              </td>
              <td className="text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                <input
                  name="inputPhone"
                  className="placeholder-gray-500 text-center w-full"
                  placeholder="Phone (required)"
                  value={inputPhone}
                  onChange={inputValueHandler}
                />
              </td>
              <td className="text-gray-500 text-sm sm:text-lg md:text-xl py-2 lg:py-8">
                (0 VND)
              </td>
              <td className="py-2 lg:py-4">
                <img
                  className="mx-auto h-5 sm:h-8 md:h-10 w-auto m-4 cursor-pointer"
                  src="images/plus.png"
                  alt="Workflow"
                  onClick={addUserHandler}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {notification && (
        <div
          className="mt-2 mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative md:py-5 md:text-lg"
          role="alert"
        >
          <span className="absolute inset-y-0 left-0 flex items-center ml-4">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </span>
          <p className="ml-6 md:font-medium">{notification}</p>
        </div>
      )}
      {loginUserInfo.role === "Admin" ? (
        <div className="flex justify-end space-x-6 pr-4 sm:space-x-12 sm:pr-10 md:space-x-16 md:mt-8 lg:pr-14 xl:space-x-28 xl:mt-12">
          <button
            className="reset-button font-semibold rounded-lg py-1 px-5 sm:py-2 sm:px-8 md:px-9 md:py-3 md:text-xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl"
            onClick={resetDataHandler}
          >
            Reset
          </button>
          <button
            className="save-button font-semibold rounded-lg py-1 px-5 sm:py-2 sm:px-8 md:px-9 md:py-3 md:text-xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl"
            onClick={saveDataHandler}
          >
            Save
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ManageMember;
