import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const BillManagement = () => {
  const relatedBills = useSelector((state) => state.auth.relatedBills);
  const userInfoEachBill = useSelector((state) => state.auth.userInfoEachBill);
  const [currentbills, setCurrentBills] = useState([...relatedBills]);
  const [viewBills, setViewBills] = useState([...relatedBills]);
  let ownerOfEachBill = [];
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
  const [editData, setEditData] = useState({});

  const dispatch = useDispatch();

  const isMemberDataSend = useSelector((state) => state.data.isMemberDataSend);
  const memberInfoInList = useSelector((state) => state.data.memberInfoInList);
  const userInfo = useSelector((state) => state.auth);

  let listUserInBill = [];
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
  if (
    editData.billInfo &&
    editData.infoOfAllMember &&
    !editData.numberOfParticipant
  ) {
    let isMemberStillInList = true;
    let numberOfParticipant = 0;
    editData.infoOfAllMember.forEach((info) => {
      const userID = info.userID;
      let checkExist = false;
      listUserInBill.forEach((userInBill, index) => {
        if (userInBill.id === userID) {
          listUserInBill[index] = {
            ...userInBill,
            select: true,
            percent: info.percent,
            monney: info.monney,
          };
          checkExist = true;
          numberOfParticipant += 1;
        }
      });
      if (!checkExist && isMemberStillInList) {
        isMemberStillInList = false;
      }
    });
    if (!isMemberStillInList) {
      listUserInBill.forEach((userInBill, index) => {
        if (userInBill.select) {
          const newPercent = 100 / numberOfParticipant;
          const total = editData.billInfo.total;
          listUserInBill[index] = {
            ...userInBill,
            percent: newPercent,
            monney: (total * newPercent) / 100,
          };
        }
      });
    }
  }

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
          const userInfoInBill = userInfoEachBill.find((el) => {
            return el.billID === item.id;
          });
          tempData.push({
            id: item.id,
            billName: item.billName,
            ownerID: item.ownerID,
            createdDate: item.createdDate,
            total: item.total,
            left: item.left,
            yourPart: userInfoInBill
              ? userInfoInBill.yourPart
              : "You don't need to pay",
            isUserPaid: userInfoInBill ? userInfoInBill.isUserPaid : false,
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
      copyBills = [...viewData];
    } else {
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
    let viewData = [...currentbills];
    if (filterType === "UserPaid") {
      viewData = viewData.filter((el) => el.isUserPaid === true);
    } else if (filterType === "UserUnpaid") {
      viewData = viewData.filter((el) => el.isUserPaid === false);
    } else if (filterType === "PaidBill") {
      viewData = viewData.filter((el) => el.billIsPaid === true);
    } else if (filterType === "UnpaidBill") {
      viewData = viewData.filter((el) => el.billIsPaid === false);
    } else if (filterType === "OwnBill") {
      viewData = viewData.filter((el) => el.ownerID === userInfo.userID);
    }
    sortBills(sortType, viewData);
  };

  const openCreateBillPopup = () => {
    setIsCreatingBill(true);
    setEditData({});
  };

  const closeCreateBillPopup = () => {
    setIsCreatingBill(false);
    setIsShowDetail(false);
    setEditData({});
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
    setIsCreatingBill(false);
  };

  const closeBillPaymentsPopup = () => {
    setIsShowBillPayments(false);
    setIsShowDetail(false);
  };

  const editBillDetail = (editData) => {
    setIsCreatingBill(true);
    setEditData(editData);
  };

  return (
    <Fragment>
      {/* {userInfo.userID.length !== 0 &&
        userInfo.name.length === 0 &&
        history.replace("/profile")} */}
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
          editData={editData}
          backToDetail={backToBillDetail}
        />
      )}
      {isMemberDataSend && allBillAreSend && isShowDetail && (
        <BillDetail
          billDetailData={billDetailData}
          loginUserIsOwner={userInfo.userID === billDetailData.ownerInfo.userID}
          onClose={closeBillDetailPopup}
          onOpenBillPayments={openBillPaymentsPopup}
          isHidden={isShowBillPayments || isCreatingBill}
          onEdit={editBillDetail}
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
