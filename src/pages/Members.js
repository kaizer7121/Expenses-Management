import { Fragment, useEffect, useRef, useState } from "react";

import ManageMember from "../components/ManageMember/ManageMember";
import Navigation from "../components/Layout/Navigation";
import { getAllUserInfo, getMemberDatas } from "../action/Action";
import Loading from "../components/Loading/Loading";
import AddMember from "../components/Popup/AddMember";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Test from "../components/test/test";

const Members = () => {
  const [isAddingMember, setIsAddingMember] = useState(false);

  const userInfo = useSelector((state) => state.auth);
  const memberInList = useSelector((state) => state.data.memberInList);
  const memberInfoInList = useSelector((state) => state.data.memberInfoInList);
  const isMemberDataSend = useSelector((state) => state.data.isMemberDataSend);
  const listAllUserInfo = useSelector((state) => state.data.allUserInfo);

  let usersNotInList = [];

  const childRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!isMemberDataSend) {
      getMemberDatas(dispatch);
      getAllUserInfo(dispatch);
    }
  }, [dispatch, isMemberDataSend]);

  if (isAddingMember) {
    usersNotInList = listAllUserInfo.filter(
      (el) => !memberInfoInList.find((delEl) => el.userID === delEl.userID)
    );
  }

  const openAddMemberPopup = () => {
    setIsAddingMember(true);
  };

  const closeAddMemberPopup = () => {
    setIsAddingMember(false);
  };

  const addMemberToList = (phone) => {
    const selectedUser = usersNotInList.filter((el) => {
      return el.phone === phone;
    });
    setIsAddingMember(false);
    childRef.current.addMemberToList(selectedUser[0]);
  };

  return (
    <div>
      {userInfo.userID.length !== 0 &&
        userInfo.name.length === 0 &&
        history.replace("/profile")}
      <Navigation />
      {!isMemberDataSend && <Loading />}
      {isMemberDataSend && (
        <ManageMember
          listUser={memberInList}
          usersInfo={memberInfoInList}
          AddMember={openAddMemberPopup}
          ref={childRef}
        />
      )}
      <Test/>
      {isMemberDataSend && isAddingMember && (
        <AddMember
          listUser={usersNotInList}
          onClose={closeAddMemberPopup}
          onAdd={addMemberToList}
        />
      )}
    </div>
  );
};

export default Members;
