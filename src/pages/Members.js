import { Fragment, useEffect, useState } from "react";

import ManageMember from "../components/ManageMember/ManageMember";
import Navigation from "../components/Layout/Navigation";
import { getDataFromFireStore } from "../action/Action";
import Loading from "../components/Loading/Loading";

const Members = () => {
  const [dataFromDB, setDataFromDB] = useState();

  useEffect(() => {
    getDataFromFireStore("Users").then((data) => {
      setDataFromDB(data);
    });
  }, []);

  return (
    <Fragment>
      <Navigation />
      {!dataFromDB && <Loading />}
      {dataFromDB && <ManageMember data={dataFromDB} />}
      
    </Fragment>
  );
};

export default Members;
