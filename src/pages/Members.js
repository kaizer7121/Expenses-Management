import { Fragment, useEffect, useState } from "react";

import ManageMember from "../components/ManageMember/ManageMember";
import Navigation from "../components/Layout/Navigation";
import {
  getDataFromFireStore,
  getSingleDataFromFireStore,
} from "../action/Action";
import Loading from "../components/Loading/Loading";

const Members = () => {
  const [listUser, setlistUser] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Fragment>
      <Navigation />
      {isLoading && <Loading />}
      {!isLoading && <ManageMember listUser={listUser} usersInfo={usersInfo} />}
    </Fragment>
  );
};

export default Members;
