import { Fragment, useEffect, useRef, useState } from "react";

import ManageMember from "../components/ManageMember/ManageMember";
import Navigation from "../components/Layout/Navigation";
import {
  getDataFromFireStore,
  getSingleDataFromFireStore,
} from "../action/Action";
import Loading from "../components/Loading/Loading";
import AddMember from "../components/Popup/AddMember";

const Members = () => {
  const [listUser, setlistUser] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingAllUser, setIsGettingAllUsers] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [listAllUserInDB, setListAllUserInDB] = useState([]);

  const childRef = useRef();

  useEffect(() => {
    getDataFromFireStore("ListUser").then((data) => {
      setlistUser(data);
      const tmpList = [];
      Promise.all(
        data.map(async (el) => {
          const ref = el.userID.path;
          const [collectionName, documentName] = ref.split("/");
          const user = await getSingleDataFromFireStore(
            collectionName,
            documentName
          );
          console.log(user);
          tmpList.push(user);
        })
      ).then(() => {
        setUsersInfo([...tmpList]);
        setIsLoading(false);
      });
    });
  }, []);

  const getAllUser = async () => {
    const tempData = await getDataFromFireStore("Users");
    const otherUsers = tempData.filter((e) => {
      return !usersInfo.find(({ userID }) => userID === e.userID);
    });
    setListAllUserInDB([...otherUsers]);
  };

  if (isGettingAllUser) {
    getAllUser().then(() => {
      setIsGettingAllUsers(false);
    });
  }

  const openAddMemberPopup = () => {
    setIsGettingAllUsers(true);
    setIsAddingMember(true);
  };

  const closeAddMemberPopup = () => {
    setIsAddingMember(false);
  };

  const addMemberToList = (phone, name) => {
    childRef.current.addMemberToList(phone, name);
  };

  return (
    <div>
      <Navigation />
      {isLoading && <Loading />}
      {!isLoading && (
        <ManageMember
          listUser={listUser}
          usersInfo={usersInfo}
          AddMember={openAddMemberPopup}
          ref={childRef}
        />
      )}
      {!isLoading && isAddingMember && !isGettingAllUser && (
        <AddMember
          listAllUser={listAllUserInDB}
          onClose={closeAddMemberPopup}
          onAdd={addMemberToList}
        />
      )}
    </div>
  );
};

export default Members;
