import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserDebtToStore,
  deconvertPhoneNumber,
  editDebtOfLoginUserInStore,
  editRelatedBillInStore,
  editUserInfoEachBillInStore,
  findRefDataFromFireStore,
  getDayMonthAndYearOfDate,
  increaseDebtOfUserInFireStore,
  updateDataToFireStore,
} from "../../action/Action";
import Backdrop from "./Backdrop/Backdrop";
import classes from "./BillDetail.module.css";

const BillDetail = (props) => {
  const [billInfo, setBillInfo] = useState({
    ...props.billDetailData.billInfo,
  });
  const [ownerInfo, setBillDetailData] = useState({
    ...props.billDetailData.ownerInfo,
  });
  const [infoOfAllMember, setInfoOfAllMember] = useState([
    ...props.billDetailData.infoOfAllMember,
  ]);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [isGetPaymentInfo, setIsGetPaymentInfo] = useState(false);
  const [notification, setNotification] = useState("");

  const userInfo = useSelector((state) => state.auth);
  const memberInList = useSelector((state) => state.data.memberInList);

  const dispatch = useDispatch();

  console.log("billInfo");
  console.log(billInfo);
  console.log("infoOfAllMember");
  console.log(infoOfAllMember);
  useEffect(() => {
    if (!isGetPaymentInfo) {
      findRefDataFromFireStore(
        "PaymentMethods",
        "userID",
        "==",
        "Users",
        ownerInfo.userID
      ).then((data) => {
        setPaymentInfo(data);
        setIsGetPaymentInfo(true);
      });
    }
  }, [isGetPaymentInfo, ownerInfo.userID]);

  const changeStatusOfPaid = (event) => {
    console.log(event.target.id);
    const userID = event.target.name;
    if (memberInList.find((item) => item.uid === userID)) {
      setNotification("");
      const selectedIndex = event.target.id;
      setInfoOfAllMember((prevValue) => {
        const status = prevValue[selectedIndex].isPaid;
        const isPaidChange = prevValue[selectedIndex].paidIsChange;
        prevValue[selectedIndex] = {
          ...prevValue[selectedIndex],
          isPaid: !status,
          paidIsChange: !isPaidChange,
        };

        let numberOfPaidMember = 0;
        prevValue.forEach((member) => {
          if (member.isPaid) numberOfPaidMember += 1;
        });
        const leftMonney =
          numberOfPaidMember === infoOfAllMember.length
            ? 0
            : infoOfAllMember.length - numberOfPaidMember ===
              infoOfAllMember.length
            ? billInfo.total
            : status
            ? billInfo.left + prevValue[selectedIndex].monney
            : billInfo.left - prevValue[selectedIndex].monney;

        setBillInfo((oldValue) => ({
          ...oldValue,
          left: leftMonney,
        }));
        return [...prevValue];
      });
    } else {
      setNotification(
        "You can't change the status of a member who is no longer on the list"
      );
    }
  };

  const closeHandler = () => {
    props.onClose();
  };

  const saveHandler = () => {
    const { billID, left } = billInfo;
    const isBillPaid = left === 0;
    updateDataToFireStore("ListBill", billID, { isBillPaid, left });
    editRelatedBillInStore(billID, { isBillPaid, left }, dispatch);

    infoOfAllMember.forEach((info) => {
      if (userInfo.userID === info.userID) {
        const selectedInfo = userInfo.userInfoEachBill.find(
          (item) => item.id === info.id
        );
        let newDebt = userInfo.debt;
        if (selectedInfo.isUserPaid !== info.isPaid) {
          newDebt = info.isPaid ? newDebt - info.monney : newDebt + info.monney;
        }
        editDebtOfLoginUserInStore(newDebt, dispatch);
        editUserInfoEachBillInStore(
          info.id,
          { isUserPaid: info.isPaid },
          dispatch
        );
      }
      updateDataToFireStore("ListUserOfBill", info.id, { isPaid: info.isPaid });
      if (info.paidIsChange) {
        const additionDebt = info.isPaid ? -info.monney : info.monney;
        increaseDebtOfUserInFireStore(info.userID, additionDebt);
        addUserDebtToStore(info.userID, additionDebt, dispatch);
      }
    });
    props.onClose();
  };

  const openBillPayments = () => {
    props.onOpenBillPayments(paymentInfo);
  };

  const editHandler = () => {
    let isOwnerParticipate = false;
    infoOfAllMember.forEach((item) => {
      if (item.userID === ownerInfo.userID) {
        isOwnerParticipate = true;
      }
    });
    const editData = {
      billInfo,
      infoOfAllMember,
      isOwnerParticipate,
    };
    props.onEdit(editData);
  };

  return (
    <div className={`${props.isHidden ? "hidden" : ""}`}>
      <Backdrop />
      <div
        className={`${classes.modal}	p-4 overflow-auto max-h-85% sm:px-8 md:p-8 lg:p-10 `}
      >
        <div className="mb-6 text-center sm:mb-12">
          <h1 className="inline font-bold pl-5 text-2xl sm:text-3xl lg:text-4xl">
            {billInfo.billName}
          </h1>
          <img
            src="images/cancel.png"
            alt="Cancel icon"
            className="inline w-5 float-right cursor-pointer"
            onClick={closeHandler}
          />
          <p className="test-base mt-0 md:mt-2 md:text-lg md:font-medium">
            Created date: {getDayMonthAndYearOfDate(billInfo.createdDate)}
          </p>
          <hr className="border-gray-300 w-1/2 mb-4 md:mb-6 "></hr>
        </div>
        <div className="mb-6 font-medium text-sm sm:mb-10 sm:text-lg md:text-lg lg:text-xl">
          <p>Owner: {ownerInfo.name}</p>
        </div>
        <div className="mb-4 font-medium text-sm sm:text-lg sm:mb-2 md:text-lg lg:text-xl">
          <p>List people have to pay: </p>
        </div>
        <div className="overflow-auto max-h-64 md:max-h-72 lg:max-h-80 xl:max-h-96">
          <table className="table-fixed border-collapse text-center mb-4 sm:mt-6 sm:mb-6 md:mb-8">
            <thead>
              <tr>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-2 md:pb-4">
                  <div>Name</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-2 md:pb-4">
                  <div>Phone</div>
                </th>
                <th className="border-b border-black text-sm w-screen pb-2 sm:text-lg sm:pb-2 md:pb-4 ">
                  <div>Money</div>
                </th>
                <th className="border-b border-black text-sm w-1/12 pb-2 sm:text-lg sm:pb-2 md:pb-4 md:w-2/12">
                  <div>Paid</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {infoOfAllMember.map((el, index) => (
                <tr key={el.userID}>
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
                  <td className="border-b border-black py-1 lg:py-4">
                    <label className="inline-flex items-center mt-2">
                      <input
                        id={index}
                        name={el.userID}
                        type="checkbox"
                        className="form-checkbox h-4 w-4  md:h-5 md:w-5"
                        checked={el.isPaid}
                        disabled={!props.loginUserIsOwner}
                        onChange={changeStatusOfPaid}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-red-500 mb-6 text-sm sm:text-base sm:mt-0 lg:-mt-4">
          {notification}
        </p>
        <div className="flex justify-between">
          <div
            className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold border-b border-black cursor-pointer"
            onClick={openBillPayments}
          >
            Payment Methods ({paymentInfo.length})
          </div>
          <div className="font-medium text-sm sm:text-base md:text-lg">
            Left:{" "}
            {billInfo.left.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        </div>
        <div
          className={`${classes.container} flex ${
            !props.loginUserIsOwner
              ? "justify-center"
              : "justify-around sm:justify-between"
          }  mt-8 sm:mt-12 sm:px-8`}
        >
          {props.loginUserIsOwner && (
            <button
              className={`${classes.close_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
              onClick={editHandler}
            >
              Edit
            </button>
          )}
          <button
            className={`${classes.save_button} font-semibold rounded-lg w-3/12 text-lg py-2 sm:w-5/24 sm:text-xl md:py-2 md:text-base lg:text-lg xl:text-xl`}
            onClick={props.loginUserIsOwner ? saveHandler : closeHandler}
          >
            {props.loginUserIsOwner ? "Save" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
