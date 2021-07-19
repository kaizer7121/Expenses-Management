import Profile from "../components/Profile/Profile";
import Loading from "../components/Loading/Loading";
import Navigation from "../components/Layout/Navigation";
import { useSelector } from "react-redux";
const ProfileUser = () => {
  const userPayment = useSelector((state) => state.auth.paymentMethods);

  return (
    <div>
      <Navigation />
      {userPayment[0] && userPayment[0].empty && <Loading />}
      {(!userPayment[0] || !userPayment[0].empty) && (
        <Profile paymentInfos={userPayment} />
      )}
    </div>
  );
};

export default ProfileUser;
