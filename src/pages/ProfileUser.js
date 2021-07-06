import { useEffect, useState } from "react";
import { getDataFromFireStore } from "../action/Action";
import Profile from "../components/Profile/Profile";
import Loading from "../components/Loading/Loading";
import Navigation from "../components/Layout/Navigation";
const ProfileUser = () => {
  const [userPayment, setUserPayment] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getDataFromFireStore("PaymentMethods").then((data) => {
      setUserPayment([...data]);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <Navigation />
      {isLoading && <Loading />}
      {!isLoading && <Profile paymentInfos={userPayment} />}
    </div>
  );
};

export default ProfileUser;
