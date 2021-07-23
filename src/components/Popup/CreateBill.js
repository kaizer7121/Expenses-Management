import classes from "./CreateBill.module.css";
import Backdrop from "./Backdrop/Backdrop";
import { Fragment, useEffect, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";
import {
  addRelatedBillToStore,
  addUserDebtToStore,
  addUserInfoEachBillToStore,
  deconvertPhoneNumber,
  deleteDataInFireStore,
  editRelatedBillInStore,
  editUserInfoEachBillInStore,
  randomString,
  updateDataToFireStore,
} from "../../action/Action";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../Firebase";

const CreateBill = (props) => {
  const type = props.editData.billInfo ? "Edit" : "Create";
  const [listMember, setListMember] = useState([...props.listUserInBill]);
  const [billInformation, setBillInformation] = useState({
    name: type === "Edit" ? props.editData.billInfo.billName : "",
    date:
      type === "Edit"
        ? new Date(props.editData.billInfo.createdDate)
        : new Date(),
    amount: type === "Edit" ? props.editData.billInfo.total : 0,
  });
  const [notification, setNotification] = useState({
    dateNoti: "",
    billNameNoti: "",
    amountNoti: "",
    paticipantNoti: "",
  });
  const [numberOfParticipant, setNumberOfParticipant] = useState(0);
  const [editNumberOfParticipant, setEditNumberOfParticipant] = useState(false);
  const [amountIsChanging, setAmountIsChanging] = useState(false);
  const [userIDIsModify, setUserIDIsModify] = useState([]);
  const [isOwnerParticipate, setIsOwnerParticipate] = useState(
    type === "Edit" ? props.editData.isOwnerParticipate : false
  );
  const userInfo = useSelector((state) => state.auth);
  const allUserInfo = useSelector((state) => state.data.allUserInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    if (type === "Edit" && !editNumberOfParticipant) {
      let trueNumberOfParticipant = 0;
      listMember.forEach((member) => {
        if (
          props.editData.infoOfAllMember.find(
            (info) => info.userID === member.id
          )
        ) {
          trueNumberOfParticipant += 1;
        }
      });
      setEditNumberOfParticipant(true);
      setNumberOfParticipant(trueNumberOfParticipant);
    }
  }, [
    props.editData.infoOfAllMember,
    listMember,
    editNumberOfParticipant,
    type,
  ]);

  const handleDayChange = (day) => {
    if (day) {
      setNotification((prevValue) => {
        return { ...prevValue, dateNoti: "" };
      });
      setBillInformation((prevValue) => {
        return { ...prevValue, date: day };
      });
    } else {
      setNotification({ dateNoti: "Date format is not correct!" });
      setBillInformation((prevValue) => {
        return { ...prevValue };
      });
    }
  };

  const handleBillNameChange = (event) => {
    const name = event.target.value;
    setNotification((prevValue) => {
      return { ...prevValue, billNameNoti: "" };
    });
    setBillInformation((prevValue) => {
      return { ...prevValue, name: name };
    });
  };

  const handleAmountBillChange = (event) => {
    const amount = event.target.value;
    if (!isNaN(amount)) {
      setBillInformation((prevValue) => {
        return { ...prevValue, amount: +amount };
      });
      let tempList = [...listMember];
      tempList.forEach((item, index) => {
        if (item.select) {
          tempList[index].monney = (amount * tempList[index].percent) / 100;
        }
      });
      setNotification((prevValue) => {
        return { ...prevValue, amountNoti: "" };
      });
      setListMember([...listMember]);
    }
  };

  const changePaticipantHandler = (event) => {
    const id = event.target.id;
    const indexSelected = listMember.findIndex((el) => el.id === id);
    const isAdd = event.target.checked;
    let tempNumberOfParticipant = numberOfParticipant;
    if (isAdd) {
      tempNumberOfParticipant++;
      setUserIDIsModify([]);
      setNumberOfParticipant((prevValue) => prevValue + 1);
      setNotification((prevValue) => {
        return { ...prevValue, paticipantNoti: "" };
      });
      if (userInfo.userID === id) {
        setIsOwnerParticipate(true);
      }
      setListMember((prevValue) => {
        const selectedUser = { ...prevValue[indexSelected] };
        prevValue[indexSelected] = {
          ...selectedUser,
          select: true,
        };
        return [...prevValue];
      });
    } else {
      if (userInfo.userID === id) {
        setIsOwnerParticipate(false);
      }
      tempNumberOfParticipant--;
      setUserIDIsModify([]);
      setNumberOfParticipant((prevValue) => prevValue - 1);
      setBillInformation((prevValue) => {
        return { ...prevValue, select: true };
      });
      setListMember((prevValue) => {
        const selectedUser = { ...prevValue[indexSelected] };
        prevValue[indexSelected] = {
          ...selectedUser,
          select: false,
          percent: 0,
          monney: 0,
        };
        return [...prevValue];
      });
    }
    setListMember((prevValue) => {
      prevValue.forEach((el, index) => {
        if (el.select) {
          const tempUser = prevValue[index];
          prevValue[index] = {
            ...tempUser,
            percent: 100 / tempNumberOfParticipant,
            monney:
              (billInformation.amount * (100 / tempNumberOfParticipant)) / 100,
          };
        }
      });
      return [...prevValue];
    });
  };

  const changePercentHandler = (event) => {
    const id = event.target.id;
    const indexSelected = listMember.findIndex((el) => el.id === id);
    const userSelected = { ...listMember[indexSelected] };
    let value = event.target.value.split("%");
    if (!isNaN(+value[0]) && userSelected.select) {
      let tempUserIDModify = [...userIDIsModify];
      let leftPercent = 100;
      if (userIDIsModify.length === 0) {
        leftPercent = 100;
      } else {
        tempUserIDModify.forEach((item) => {
          leftPercent -= item.percent;
        });
      }

      if (+value[0] >= leftPercent) {
        value[0] = leftPercent;
      }
      const currentIndex = tempUserIDModify.findIndex((el) => {
        return el.id === id;
      });
      if (currentIndex === -1) {
        tempUserIDModify.push({ id, percent: +value[0] });
      } else {
        tempUserIDModify.splice(currentIndex, 1);
        tempUserIDModify.push({ id, percent: +value[0] });
      }

      if (tempUserIDModify.length === numberOfParticipant) {
        tempUserIDModify.splice(0, 1);
      }

      leftPercent = 100;
      tempUserIDModify.forEach((item) => {
        leftPercent -= item.percent;
      });

      setListMember((prevValue) => {
        const selectedUser = { ...prevValue[indexSelected] };
        prevValue[indexSelected] = {
          ...selectedUser,
          percent: value[0],
          monney: (billInformation.amount * value[0]) / 100,
        };
        prevValue.forEach((el, index) => {
          const findIndex = tempUserIDModify.findIndex(
            (anotherEl) => anotherEl.id === el.id
          );
          if (findIndex === -1) {
            if (index !== indexSelected && el.select) {
              const tempUser = prevValue[index];
              const newPercent =
                leftPercent / (numberOfParticipant - tempUserIDModify.length);
              prevValue[index] = {
                ...tempUser,
                percent: newPercent,
                monney: (billInformation.amount * newPercent) / 100,
              };
            }
          }
        });
        return [...prevValue];
      });
      setUserIDIsModify([...tempUserIDModify]);
    }
  };

  const saveHandler = async () => {
    let dateNoti = "";
    let billNameNoti = "";
    let amountNoti = "";
    let paticipantNoti = "";
    let checkValidate = true;

    if (!billInformation.name && billInformation.name.length <= 0) {
      billNameNoti = "Name of bill must not be empty";
      checkValidate = false;
    }
    if (!billInformation.amount && billInformation.amount <= 0) {
      amountNoti = "Amount of bill must greater than 0";
      checkValidate = false;
    }
    if (numberOfParticipant === 0) {
      paticipantNoti = "This bill don't have any paticipant";
      checkValidate = false;
    }
    if (notification.dateNoti.length > 0) {
      dateNoti = notification.dateNoti;
      checkValidate = false;
    }
    if (!checkValidate) {
      setNotification({ dateNoti, billNameNoti, amountNoti, paticipantNoti });
    } else if (type === "Create") {
      let ownerInfo = {};
      if (isOwnerParticipate) {
        ownerInfo = listMember.find((el) => {
          return el.id === userInfo.userID;
        });
      }

      const randomBillID = randomString(15);
      const leftMonney = isOwnerParticipate
        ? billInformation.amount - ownerInfo.monney
        : billInformation.amount;
      const fullBillInfo = {
        id: randomBillID,
        billName: billInformation.name,
        createdDate: billInformation.date.toString(),
        owner: db.collection("Users").doc(userInfo.userID),
        total: billInformation.amount,
        left: leftMonney,
        isBillPaid: leftMonney === billInformation.amount,
      };
      if (isOwnerParticipate) {
        addRelatedBillToStore(fullBillInfo, dispatch);
      }
      updateDataToFireStore("ListBill", randomBillID, fullBillInfo);
      listMember.forEach((member) => {
        if (member.select) {
          const participantID = randomString(15);
          const participant = {
            id: participantID,
            user: db.collection("Users").doc(member.id),
            bill: db.collection("ListBill").doc(randomBillID),
            monney: member.monney,
            percent: member.percent,
            isPaid:
              isOwnerParticipate && member.id === ownerInfo.id ? true : false,
          };
          updateDataToFireStore("ListUserOfBill", participantID, participant);
          if (isOwnerParticipate && member.id === ownerInfo.id) {
            addUserInfoEachBillToStore(participant, dispatch);
          }
          if (!isOwnerParticipate || member.id !== ownerInfo.id) {
            addUserDebtToStore(member.id, member.monney, dispatch);
            const memberInfo = allUserInfo.find(
              (el) => el.userID === member.id
            );
            updateDataToFireStore("Users", member.id, {
              debt: memberInfo.debt + member.monney,
            });
          }
        }
      });
      setNotification({
        dateNoti: "",
        billNameNoti: "",
        amountNoti: "",
        paticipantNoti: "",
      });
      props.onClose();
    } else if (type === "Edit") {
      let ownerInfo = {};
      if (isOwnerParticipate) {
        ownerInfo = listMember.find((el) => {
          return el.id === userInfo.userID;
        });
      }
      const leftMonney = isOwnerParticipate
        ? billInformation.amount - ownerInfo.monney
        : billInformation.amount;
      const newInfoOfBill = {
        billName: billInformation.name,
        createdDate: billInformation.date.toString(),
        total: billInformation.amount,
        left: leftMonney,
        isBillPaid: leftMonney === billInformation.amount,
      };
      const billID = props.editData.billInfo.billID;
      if (isOwnerParticipate) {
        editRelatedBillInStore(billID, newInfoOfBill, dispatch);
      }
      updateDataToFireStore("ListBill", billID, newInfoOfBill);

      props.editData.infoOfAllMember.forEach((info) => {
        deleteDataInFireStore("ListUserOfBill", info.id);
      });

      listMember.forEach((member) => {
        if (member.select) {
          const infoOfAllMember = props.editData.infoOfAllMember;
          const infoOfMember = infoOfAllMember.find((info) => {
            return info.userID === member.id;
          });

          const participantID = randomString(15);
          const participant = {
            id: participantID,
            user: db.collection("Users").doc(member.id),
            bill: db.collection("ListBill").doc(billID),
            monney: member.monney,
            percent: member.percent,
            isPaid:
              isOwnerParticipate && member.id === ownerInfo.id ? true : false,
          };
          updateDataToFireStore("ListUserOfBill", participantID, participant);
          if (isOwnerParticipate && member.id === ownerInfo.id) {
            if (infoOfMember) {
              editUserInfoEachBillInStore(
                infoOfMember.id,
                {
                  id: participant.id,
                  yourPart: participant.monney,
                  percent: participant.percent,
                  isUserPaid: participant.isPaid,
                },
                dispatch
              );
            } else {
              addUserInfoEachBillToStore(participant, dispatch);
            }
          }
          if (!isOwnerParticipate || member.id !== ownerInfo.id) {
            let trueDebt = member.monney;
            if (infoOfMember && !infoOfMember.isPaid) {
              trueDebt -= infoOfMember.monney;
            }
            addUserDebtToStore(member.id, trueDebt, dispatch);
            const memberInfo = allUserInfo.find(
              (el) => el.userID === member.id
            );
            updateDataToFireStore("Users", member.id, {
              debt: memberInfo.debt + trueDebt,
            });
          }
        }
      });
      setNotification({
        dateNoti: "",
        billNameNoti: "",
        amountNoti: "",
        paticipantNoti: "",
      });
      props.onClose();
    }
  };

  const cancelHandler = () => {
    props.onClose();
  };

  const backToDetailHandler = () => {
    props.backToDetail();
  };

  return (
    <Fragment>
      <Backdrop />
      <div
        className={`${classes.modal} p-4 overflow-auto max-h-85% md:p-8 lg:p-10`}
      >
        <div className="w-full mb-8 ">
          <div className="mb-2 font-semibold text-2xl sm:text-3xl lg:text-4xl">
            <h1 className="inline">Bill Information</h1>
            <img
              src="images/cancel.png"
              alt="Cancel icon"
              className="inline w-5 float-right cursor-pointer"
              onClick={cancelHandler}
            />
          </div>
          <div className="border-b border-gray-600 py-2 mr-1">
            <input
              className="appearance-none bg-transparent w-full text-gray-700 leading-tight focus:outline-none font-medium text-lg sm:text-xl lg:text-2xl lg:font-semibold"
              type="text"
              placeholder="Name of bill"
              value={billInformation.name}
              onChange={handleBillNameChange}
            ></input>
          </div>
          {notification.billNameNoti &&
            notification.billNameNoti.length > 0 && (
              <p className="text-red-500 mb-6 text-sm sm:text-base sm:mt-0 sm:mb-0">
                {notification.billNameNoti}
              </p>
            )}
        </div>
        <div className="w-full">
          <img
            src="images/calendar.png"
            alt="Calendar icon"
            className="inline w-1/8 lg:w-1/12"
          />
          <div className="border-b border-gray-600 py-1 inline-block ml-3 w-10/12 mb-10 sm:mt-8 lg:mb-6 lg:mt-6 lg:ml-12 sm:text-lg lg:text-xl lg:font-bold">
            <DayPickerInput
              value={billInformation.date}
              onDayChange={(day) => {
                handleDayChange(day);
              }}
              inputProps={{ style: { width: "15rem", fontWeight: "500" } }}
              formatDate={formatDate}
              parseDate={parseDate}
              placeholder="Date"
              dayPickerProps={{
                month: new Date(),
                showWeekNumbers: true,
                todayButton: "Today",
              }}
            />
          </div>
          {notification.dateNoti && notification.dateNoti.length > 0 && (
            <p className="text-red-500 -mt-6 mb-6 text-sm sm:text-base sm:mt-0 sm:mb-0">
              {notification.dateNoti}
            </p>
          )}
        </div>
        <div className="w-full">
          <img
            src="images/cash.png"
            alt="Calendar icon"
            className="inline w-1/8 lg:w-1/12"
          />
          <div className="border-b border-gray-600 py-1 inline-block ml-3 w-10/12 mb-10 sm:mt-8 lg:mb-6 lg:mt-6 lg:ml-12">
            <input
              className="appearance-none bg-transparent text-gray-700 leading-tight focus:outline-none text-base sm:text-lg lg:text-xl lg:font-medium"
              type="text"
              placeholder="Amount"
              value={
                amountIsChanging
                  ? billInformation.amount
                  : billInformation.amount.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })
              }
              onChange={handleAmountBillChange}
              onFocus={() => {
                setAmountIsChanging(true);
              }}
              onBlur={() => {
                setAmountIsChanging(false);
              }}
            ></input>
          </div>
          {notification.amountNoti && notification.amountNoti.length > 0 && (
            <p className="text-red-500 mb-6 text-sm sm:text-base sm:mt-0 sm:mb-0">
              {notification.amountNoti}
            </p>
          )}
        </div>
        <div className="overflow-auto max-h-64 md:max-h-72 lg:max-h-80 xl:max-h-88">
          <table className="table-fixed border-collapse text-center sm:mt-6 ">
            <thead>
              <tr>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-3 md:pb-6 md:text-xl md:w-4/12">
                  <div>Name</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-3 md:pb-6 md:text-xl md:w-3/12">
                  <div>Phone</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-3 md:pb-6 md:text-xl md:w-2/12">
                  <div>Money</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-3 md:pb-6 md:text-xl md:w-2/12">
                  <div>Percent</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-3 md:pb-6 md:text-xl md:w-1/12">
                  <div>Select</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {listMember.map((el) => (
                <tr key={el.id}>
                  <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-4">
                    {el.name}
                  </td>
                  <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-4">
                    {deconvertPhoneNumber(el.phone)}
                  </td>
                  <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-4">
                    {el.monney.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-4">
                    <input
                      id={el.id}
                      className="w-8/12 md:w-full text-center appearance-none bg-transparent leading-tight focus:outline-none"
                      type="text"
                      value={`${(+el.percent).toFixed(1)}%`}
                      onChange={changePercentHandler}
                    ></input>
                  </td>
                  <td className="border-b border-black py-2 lg:py-6">
                    <label className="inline-flex items-center mt-3">
                      <input
                        id={el.id}
                        type="checkbox"
                        className="form-checkbox h-5 w-5"
                        checked={el.select}
                        onChange={changePaticipantHandler}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {notification.paticipantNoti &&
          notification.paticipantNoti.length > 0 && (
            <p className="text-red-500 mb-6 text-sm sm:text-base sm:mt-0 sm:mb-0">
              {notification.paticipantNoti}
            </p>
          )}
        <div className="flex justify-around mt-8 sm:justify-between sm:mt-12 sm:px-8">
          <button
            className={`${classes.close_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
            onClick={type === "Edit" ? backToDetailHandler : cancelHandler}
          >
            {type === "Edit" ? "Back" : "Cancel"}
          </button>
          <button
            className={`${classes.save_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
            onClick={saveHandler}
          >
            Save
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateBill;
