import { useEffect, useState } from "react";
import {
  findDataFromFireStore,
  getMonthAndYearOfDate,
  getSingleDataFromFireStore,
} from "../../action/Action";
import { db } from "../../Firebase";
import classes from "./ListBill.module.css";

let ownerOfEachBill = [];

const ListBill = (props) => {
  const [listBill, setListBill] = useState([...props.bills]);
  const [isGettingDetail, setIsGettingDetail] = useState(false);
  const setPaidColor = {
    backgroundColor: classes.background77ACF1,
    buttonColor: classes.buttonF0EBCC,
    textColor: classes.textBlack,
  };

  const setUnpaidColor2 = {
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
    listBill.map((el) => {
      ownerOfEachBill.push({ billID: el.id });
      return getOwnerOfBill(el.ownerID, el.id);
    });
  }, [listBill]);

  const showBillDetail = async (element) => {
    if (!isGettingDetail) {
      setIsGettingDetail(true);
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

      console.log("ownerInfo");
      console.log(ownerInfo);
      console.log("infoOfAllMember");
      console.log(infoOfAllMember);

      const billInfo = {
        billID: element.id,
        billName: element.billName,
        createdDate: element.createdDate,
        total: element.total,
        left: element.left,
      };
      console.log(billInfo);
      setIsGettingDetail(false);
      props.openBillDetailPopup(billInfo, ownerInfo, infoOfAllMember);
    }
  };

  return (
    <div className="grid justify-items-center grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-2 sm:mt-6 md:mt-12 2xl:mt-18">
      {props.bills.map((el) => {
        const cardColor = el.billIsPaid ? setPaidColor : setUnpaidColor2;
        return (
          <div
            key={el.id}
            className="max-w-md inline-flex items-center justify-center w-full mb-8 md:mb-12 lg:mb-16"
          >
            <div
              className={`w-11/12 md:w-full mt-4 ${cardColor.backgroundColor} rounded-lg`}
            >
              <div className="w-full mb-4">
                <p className="appearance-none w-full py-2 px-4 leading-tight font-bold text-left text-2xl  md:text-3xl xl:text-3xl ">
                  {`${el.billName} (${getMonthAndYearOfDate(el.createdDate)}) ${
                    el.billIsPaid ? "(paid)" : ""
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

              <div className="text-right mr-4 pb-4">
                <button
                  className={`shadow ${cardColor.buttonColor} ${
                    cardColor.buttonHoverColor
                  } ${
                    isGettingDetail ? "cursor-wait bg-gray-600" : ""
                  } focus:shadow-outline focus:outline-none ${
                    cardColor.textColor
                  } font-semibold py-2 px-5 rounded`}
                  type="button"
                  onClick={() => {
                    showBillDetail(el);
                  }}
                >
                  Detail
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
