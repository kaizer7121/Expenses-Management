import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  findDataFromFireStore,
  getMonthAndYearOfDate,
  getSingleDataFromFireStore,
} from "../../action/Action";
import { db } from "../../Firebase";
import classes from "./ListBill.module.css";

let ownerOfEachBill = [];

const ListBill = (props) => {
  const [isGettingDetail, setIsGettingDetail] = useState({
    status: false,
    index: -1,
  });
  const userInfo = useSelector((state) => state.auth);
  console.log(ownerOfEachBill);
  const setUnpaidColor = {
    backgroundColor: classes.background77ACF1,
    buttonColor: classes.buttonF0EBCC,
    textColor: classes.textBlack,
  };

  const setPaidColor = {
    backgroundColor: classes.background1EAE98,
    buttonColor: classes.buttonFFFFC7,
    textColor: classes.textBlack,
  };

  useEffect(() => {
    const getOwnerOfBill = (ownerID, billID) => {
      const checkIndex = ownerOfEachBill.findIndex(
        (el) => el.billID === billID
      );
      getSingleDataFromFireStore("Users", ownerID).then((data) => {
        const newData = { billID: billID, owner: data };
        ownerOfEachBill[checkIndex] = newData;
      });
    };
    props.bills.forEach((el) => {
      const findIndex = ownerOfEachBill.findIndex(
        (element) => element.billID === el.id
      );
      if (findIndex === -1) {
        ownerOfEachBill.push({ billID: el.id });
        return getOwnerOfBill(el.ownerID, el.id);
      }
    });
  }, [props.bills]);

  const showBillDetail = async (element, index) => {
    if (!isGettingDetail.status) {
      setIsGettingDetail({ status: true, index: index });
      console.log(element);
      const infoOfAllMember = [];
      const ownerID = element.ownerID;
      const ownerInfo = ownerOfEachBill.find(({ owner }) => {
        return owner.userID === ownerID;
      }).owner;
      const listMember = await findDataFromFireStore(
        "ListUserOfBill",
        "bill",
        "==",
        db.collection("ListBill").doc(element.id)
      );

      await Promise.all(
        listMember.map(async (member) => {
          const userID = member.user.path.split("/")[1];
          const userInfo = await getSingleDataFromFireStore("Users", userID);
          const memberInfo = {
            userID: userInfo.userID,
            name: userInfo.name,
            phone: userInfo.phone,
            monney: member.monney,
            percent: member.percent,
            isPaid: member.isPaid,
            id: member.id,
            paidIsChange: false,
          };
          infoOfAllMember.push(memberInfo);
        })
      );

      const billInfo = {
        billID: element.id,
        billName: element.billName,
        createdDate: element.createdDate,
        total: element.total,
        left: element.left,
      };
      setIsGettingDetail({ status: false, index: -1 });
      props.openBillDetailPopup(billInfo, ownerInfo, infoOfAllMember);
    }
  };

  return (
    <div className="grid justify-items-center grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-2 sm:mt-6 md:mt-12 2xl:mt-18">
      {props.bills.map((el, index) => {
        const cardColor = el.billIsPaid ? setPaidColor : setUnpaidColor;
        return (
          <div
            key={el.id}
            className="max-w-md inline-flex items-center justify-center w-full mb-8 md:mb-12 lg:mb-16"
          >
            <div
              className={`min-h-large w-11/12 md:w-full mt-4 ${cardColor.backgroundColor} rounded-lg`}
            >
              <div className="w-full mb-4">
                <p className="appearance-none w-full py-2 px-4 leading-tight font-bold text-left text-2xl  md:text-3xl xl:text-3xl ">
                  {`${el.billName} (${getMonthAndYearOfDate(el.createdDate)}) ${
                    el.ownerID === userInfo.userID ? "(OWNER)" : ""
                  }`}
                </p>
              </div>
              <div className="sm:w-3/4">
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left">
                  {`Total: 
                  ${el.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}`}
                </p>
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left">
                  {`Left: 
                  ${el.left.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}`}
                </p>
                <p className="appearance-none w-full font-medium py-2 px-4 leading-tight text-lg text-left float-left">
                  {`Your part: 
                  ${el.yourPart.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  `}
                  <span className="font-bold text-xl">
                    {el.isUserPaid ? "(PAID)" : ""}
                  </span>
                </p>
              </div>

              <div className="text-right mr-4 pb-4 ">
                <button
                  className={`shadow ${cardColor.buttonColor} ${
                    isGettingDetail.status
                      ? "cursor-not-allowed"
                      : "hover:bg-coral-reef"
                  } focus:shadow-outline focus:outline-none ${
                    cardColor.textColor
                  } font-semibold py-2 px-5 rounded`}
                  type="button"
                  onClick={() => {
                    showBillDetail(el, index);
                  }}
                >
                  <img
                    src={`images/loadingDetail${el.billIsPaid ? "1" : "2"}.png`}
                    alt="loading"
                    className={`animate-spin px-2 bg-opacity-0 ${
                      isGettingDetail.status && isGettingDetail.index === index
                        ? ""
                        : "hidden"
                    }`}
                  />
                  {isGettingDetail.status && isGettingDetail.index === index
                    ? ""
                    : "Detail"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListBill;
