import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllUserInfo, getMemberDatas } from "../../action/Action";
import Loading from "../Loading/Loading";
import CreateBill from "../Popup/CreateBill";
import ListBill from "./ListBill";
import ProcessingButton from "./ProcessingButton";

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
  const [bills, setBills] = useState(DUMMY_DATA);
  const [viewBills, setViewBills] = useState([...bills]);
  const [isCreatingBill, setIsCreatingBill] = useState(false);

  const dispatch = useDispatch();
  const childRef = useRef();
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
  }, [dispatch, isMemberDataSend]);

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
    let viewData = [...bills];
    if (filterType === "Paid") {
      console.log("PAID");
      viewData = viewData.filter((el) => el.isPaid === true);
    } else if (filterType === "Unpaid") {
      console.log("UNPAID");
      viewData = viewData.filter((el) => el.isPaid === false);
    }
    sortBills(sortType, viewData);
  };

  const openCreateBillPopup = () => {
    setIsCreatingBill(true);
  };

  const closeCreateBillPopup = () => {
    setIsCreatingBill(false);
  };

  return (
    <Fragment>
      {userInfo.userID.length !== 0 &&
        userInfo.name.length === 0 &&
        history.replace("/profile")}
      {!isMemberDataSend && <Loading />}
      {isMemberDataSend && (
        <Fragment>
          <ProcessingButton
            onSort={sortBills}
            onFilter={filterBills}
            onOpen={openCreateBillPopup}
          />
          <ListBill bills={viewBills} ref={childRef} />
        </Fragment>
      )}
      {isMemberDataSend && isCreatingBill && (
        <CreateBill
          listUserInBill={listUserInBill}
          onClose={closeCreateBillPopup}
        />
      )}
    </Fragment>
  );
};

export default BillManagement;
