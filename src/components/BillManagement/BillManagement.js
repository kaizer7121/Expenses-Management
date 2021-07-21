import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getAllUserInfo,
  getMemberDatas,
  getRelatedBills,
} from "../../action/Action";
import Loading from "../Loading/Loading";
import BillDetail from "../Popup/BillDetail";
import CreateBill from "../Popup/CreateBill";
import ListBill from "./ListBill";
import ProcessingButton from "./ProcessingButton";
import UserPaymentMethods from "../Popup/UserPaymentMethods";

const DUMMY_DATA = [
  {
    billName: "Electricity bill",
    createdDate: "7/2021",
    total: 500000,
    left: 400000,
    yourPart: 100000,
    isPaid: true,
  },
  {
    billName: "Water bill",
    createdDate: "6/2021",
    total: 250000,
    left: 200000,
    yourPart: 120000,
    isPaid: false,
  },
  {
    billName: "Wifi bill",
    createdDate: "4/2021",
    total: 100000,
    left: 100000,
    yourPart: 50000,
    isPaid: false,
  },
  {
    billName: "Wifi bill",
    createdDate: "4/2021",
    total: 100000,
    left: 100000,
    yourPart: 50000,
    isPaid: false,
  },
  {
    billName: "Electricity bill",
    createdDate: "7/2021",
    total: 500000,
    left: 400000,
    yourPart: 100000,
    isPaid: true,
  },
];

const BillManagement = () => {
  const relatedBills = useSelector((state) => state.auth.relatedBills);
  const userInfoEachBill = useSelector((state) => state.auth.userInfoEachBill);
  const [currentbills, setCurrentBills] = useState([...relatedBills]);
  const [viewBills, setViewBills] = useState([...relatedBills]);
  const [ownerOfEachBill, setOwnerOfEachBill] = useState([]);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [allBillAreSend, setAllBillAreSend] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [billDetailData, setBillDetailData] = useState({
    billInfo: {},
    ownerInfo: {},
    infoOfAllMember: [],
  });
  const [isShowBillPayments, setIsShowBillPayments] = useState(false);
  const [billPaymentsInfo, setBillPaymentsInfo] = useState();

  const dispatch = useDispatch();
  const history = useHistory();

  const isMemberDataSend = useSelector((state) => state.data.isMemberDataSend);
  const memberInfoInList = useSelector((state) => state.data.memberInfoInList);
  const userInfo = useSelector((state) => state.auth);
  const listUserInBill = [];
  memberInfoInList.map((el) => {
    const userInBill = {
      id: el.userID,
      name: el.name,
      phone: el.phone,
      monney: 0,
      percent: 0,
      select: false,
    };
    return listUserInBill.push(userInBill);
  });

  useEffect(() => {
    if (!isMemberDataSend) {
      getMemberDatas(dispatch);
      getAllUserInfo(dispatch);
    }
    if (userInfo.userID !== "") {
      if (relatedBills[0] && relatedBills[0].empty) {
        getRelatedBills(userInfo.userID, dispatch);
      } else {
        const tempData = [];
        relatedBills.forEach((item, index) => {
          tempData.push({
            id: item.id,
            billName: item.billName,
            ownerID: item.ownerID,
            createdDate: item.createdDate,
            total: item.total,
            left: item.left,
            yourPart: userInfoEachBill[index].yourPart,
            isUserPaid: userInfoEachBill[index].isUserPaid,
            billIsPaid: item.left === 0,
          });
        });
        setViewBills([...tempData]);
        setCurrentBills([...tempData]);
        setAllBillAreSend(true);
      }
    }
  }, [
    dispatch,
    isMemberDataSend,
    userInfo.userID,
    relatedBills,
    userInfoEachBill,
  ]);

  const sortBills = (sortType, viewData) => {
    const { sortDateType, sortTotalType } = sortType;
    let copyBills = [];
    if (viewData) {
      console.log("type full");
      console.log(viewData);
      copyBills = [...viewData];
    } else {
      console.log("Type lack");
      copyBills = [...viewBills];
    }

    if (sortDateType === 1) {
      copyBills.sort((firstEL, secondEl) => {
        return firstEL.createdDate > secondEl.createdDate ? 1 : -1;
      });
    } else if (sortDateType === 2) {
      copyBills.sort((firstEL, secondEl) => {
        return firstEL.createdDate < secondEl.createdDate ? 1 : -1;
      });
    } else if (sortTotalType === 1) {
      copyBills.sort((firstEL, secondEl) => {
        return firstEL.total > secondEl.total ? 1 : -1;
      });
    } else if (sortTotalType === 2) {
      copyBills.sort((firstEL, secondEl) => {
        return firstEL.total < secondEl.total ? 1 : -1;
      });
    }
    setViewBills([...copyBills]);
  };

  const filterBills = (filterType, sortType) => {
    console.log(filterType);
    let viewData = [...currentbills];
    if (filterType === "UserPaid") {
      viewData = viewData.filter((el) => el.isUserPaid === true);
    } else if (filterType === "UserUnpaid") {
      viewData = viewData.filter((el) => el.isUserPaid === false);
    } else if (filterType === "PaidBill") {
      viewData = viewData.filter((el) => el.billIsPaid === true);
    } else if (filterType === "UnpaidBill") {
      viewData = viewData.filter((el) => el.billIsPaid === false);
    }
    sortBills(sortType, viewData);
  };

  const openCreateBillPopup = () => {
    setIsCreatingBill(true);
  };

  const closeCreateBillPopup = () => {
    setIsCreatingBill(false);
  };

  const openBillDetailPopup = (billInfo, ownerInfo, infoOfAllMember) => {
    setBillDetailData({ billInfo, ownerInfo, infoOfAllMember });
    setIsShowDetail(true);
  };

  const closeBillDetailPopup = () => {
    setIsShowDetail(false);
  };

  const openBillPaymentsPopup = (paymentInfo) => {
    setBillPaymentsInfo(paymentInfo);
    setIsShowBillPayments(true);
  };

  const backToBillDetail = () => {
    setIsShowBillPayments(false);
  };

  const closeBillPaymentsPopup = () => {
    setIsShowBillPayments(false);
    setIsShowDetail(false);
  };

  return (
    <Fragment>
      {userInfo.userID.length !== 0 &&
        userInfo.name.length === 0 &&
        history.replace("/profile")}
      {(!isMemberDataSend || !allBillAreSend) && <Loading />}
      {isMemberDataSend && allBillAreSend && (
        <Fragment>
          <ProcessingButton
            onSort={sortBills}
            onFilter={filterBills}
            onOpen={openCreateBillPopup}
          />
          <ListBill
            bills={viewBills}
            userInfoEachBill={userInfoEachBill}
            ownerOfEachBill={ownerOfEachBill}
            openBillDetailPopup={openBillDetailPopup}
          />
        </Fragment>
      )}
      {isMemberDataSend && allBillAreSend && isCreatingBill && (
        <CreateBill
          listUserInBill={listUserInBill}
          onClose={closeCreateBillPopup}
        />
      )}
      {isMemberDataSend && allBillAreSend && isShowDetail && (
        <BillDetail
          billDetailData={billDetailData}
          loginUserIsOwner={userInfo.userID === billDetailData.ownerInfo.userID}
          onClose={closeBillDetailPopup}
          onOpenBillPayments={openBillPaymentsPopup}
          isHidden={isShowBillPayments}
        />
      )}
      {isMemberDataSend && allBillAreSend && isShowBillPayments && (
        <UserPaymentMethods
          onClose={closeBillPaymentsPopup}
          backToDetail={backToBillDetail}
          billPaymentsInfo={billPaymentsInfo}
        />
      )}
    </Fragment>
  );
};

export default BillManagement;
