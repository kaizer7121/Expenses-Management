import { useImperativeHandle } from "react";
import { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDataInFireStore,
  updateDataToFireStore,
  deconvertPhoneNumber,
  randomString,
  addMemberInStore,
} from "../../action/Action";
import { db } from "../../Firebase";

import classes from "./ListMember.module.css";

const ManageMember = forwardRef((props, ref) => {
  const [usersInfo, setUsersInfo] = useState([...props.usersInfo]);
  const [listUser, setListUser] = useState([...props.listUser]);
  const [backupArray, setBackupArray] = useState({
    usersInfo: [...usersInfo],
    listUser: [...listUser],
  });
  const [deleteUsersID, setDeleteUserID] = useState([]);
  const [arrayIsChange, setArrayIsChange] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const loginUserInfo = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    addMemberToList(selectedUser) {
      setUsersInfo((prevValue) => [...prevValue, selectedUser]);
      const newUserInList = {
        id: randomString(20),
        userID: db.collection("Users").doc(selectedUser.userID),
      };
      setListUser((prevValue) => [...prevValue, newUserInList]);
      setArrayIsChange(true);
    },
  }));

  const removeUserHandler = (event) => {
    const targetedId = event.target.name;
    let selectedIndex = listUser.findIndex((el) => el.id === targetedId);
    let idDeleted = "";
    if (usersInfo[selectedIndex].debt > 0) {
      setNotification({
        message: "You can't remove member who having a debt!",
        type: "Warning",
      });
    } else {
      setListUser((prevValue) => {
        idDeleted = prevValue[selectedIndex].id;
        prevValue.splice(selectedIndex, 1);
        return [...prevValue];
      });
      setUsersInfo((prevValue) => {
        prevValue.splice(selectedIndex, 1);
        return [...prevValue];
      });

      setDeleteUserID((prevValue) => {
        return [...prevValue, idDeleted];
      });
      setArrayIsChange(true);
      setNotification({
        message: "",
        type: "",
      });
    }
  };

  const addUserHandler = () => {
    setNotification({
      message: "",
      type: "",
    });
    props.AddMember();
  };

  const resetDataHandler = () => {
    setUsersInfo([...backupArray.usersInfo]);
    setListUser([...backupArray.listUser]);
    setDeleteUserID([]);
    setNotification({
      message: "",
      type: "",
    });
    setArrayIsChange(false);
  };

  const saveDataHandler = () => {
    if (arrayIsChange) {
      setBackupArray(usersInfo);
      console.log("listUser:--------------");
      console.log(listUser);
      deleteUsersID.map((el) => {
        return deleteDataInFireStore("ListUser", el);
      });
      const reduxData = [];
      listUser.map((el) => {
        const { id, userID } = el;
        if (userID) {
          const uid = userID.path.split("/")[1];
          reduxData.push({ id, uid });
          return updateDataToFireStore("ListUser", el.id, el);
        }
      });
      addMemberInStore(reduxData, usersInfo, dispatch);
    }
    setNotification({
      message: "Save completely!",
      type: "Success",
    });
  };

  return (
    <div>
      <div className="mt-12 lg:mt-16 text-center w-full text-2xl font-semibold mb-8 sm:text-4xl md:w-3/12 md:border-b md:text-left md:text-3xl md:4/12 md:mb-12 lg:text-4xl lg:mx-16 lg:w-3/12 lg:mb-20 2xl:w-2/12">
        <h1>Members</h1>
      </div>
      <table className="table-fixed border-collapse text-center lg:mx-16">
        <thead>
          <tr>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Name</div>
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
                  {el.name}
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-8">
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
                <p className="text-gray-500 text-center w-full">
                  Name
                </p>
              </td>
              <td className="text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                <p className="text-gray-500 text-center w-full">
                  Phone
                </p>
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
      {notification.message !== "" && (
        <div
          className={`relative my-6 py-3 pl-4 pr-10 leading-normal ${
            notification.type === "Warning"
              ? "text-red-700 bg-red-100 "
              : "text-green-700 bg-green-100 "
          }rounded-lg`}
        >
          <p className="font-medium pl-2 text-sm sm:text-base md:text-lg lg:pl-8 xl:text-xl">
            {notification.message}
          </p>
        </div>
      )}
      {loginUserInfo.role === "Admin" && (
        <div className="flex justify-end space-x-6 pr-4 sm:space-x-12 sm:pr-10 md:space-x-16 md:mt-8 lg:pr-14 xl:space-x-28 xl:mt-12">
          <button
            className={`${classes.resetButton} font-semibold rounded-lg py-1 px-5 sm:py-2 sm:px-8 md:px-9 md:py-3 md:text-xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl`}
            onClick={resetDataHandler}
          >
            Reset
          </button>
          <button
            className={`${classes.saveButton} font-semibold rounded-lg py-1 px-5 sm:py-2 sm:px-8 md:px-9 md:py-3 md:text-xl lg:px-12 lg:text-2xl  xl:px-14 xl:text-2xl`}
            onClick={saveDataHandler}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
});

export default ManageMember;
