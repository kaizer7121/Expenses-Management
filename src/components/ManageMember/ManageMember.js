import { useEffect, useRef, useState } from "react";

import ListMember from "./ListMember";
import { getAllUserInfo, getMemberDatas } from "../../action/Action";
import Loading from "../Loading/Loading";
import AddMember from "../Popup/AddMember";
import { useDispatch, useSelector } from "react-redux";

const Members = () => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [queueAddMember, setQueueAddMember] = useState([]);

  const memberInList = useSelector((state) => state.data.memberInList);
  const memberInfoInList = useSelector((state) => state.data.memberInfoInList);
  const isMemberDataSend = useSelector((state) => state.data.isMemberDataSend);
  const listAllUserInfo = useSelector((state) => state.data.allUserInfo);

  let usersNotInList = [];

  const childRef = useRef();
  const dispatch = useDispatch();

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
    usersNotInList = usersNotInList.filter(
      (user) => !queueAddMember.find((el) => user.userID === el.userID)
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
    setQueueAddMember((prevValue) => [...prevValue, ...selectedUser]);
    setIsAddingMember(false);
    childRef.current.addMemberToList(selectedUser[0]);
  };

  return (
    <div>
      {/* {userInfo.userID.length !== 0 &&
        userInfo.name.length === 0 &&
        history.replace("/profile")} */}
      {!isMemberDataSend && <Loading />}
      {isMemberDataSend && (
        <ListMember
          listUser={memberInList}
          usersInfo={memberInfoInList}
          AddMember={openAddMemberPopup}
          ref={childRef}
        />
      )}
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
