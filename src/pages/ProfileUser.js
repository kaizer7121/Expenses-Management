import { useEffect, useState } from "react";
import { getDataFromFireStore } from "../action/Action";
import Profile from "../components/Profile/Profile";
import Loading from "../components/Loading/Loading";
import Navigation from "../components/Layout/Navigation";
import { useSelector } from "react-redux";
const ProfileUser = () => {
  const userPayment = useSelector((state) => state.data.paymentMethods);

  return (
    <div>
      <Navigation />
      <Profile paymentInfos={userPayment} />
    </div>
  );
};

export default ProfileUser;
