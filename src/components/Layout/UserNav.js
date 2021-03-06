import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { authAction } from "../../store/authSlice";
import { tokenAction } from "../../store/tokenSlice";
import { useHistory } from "react-router";
import { dataAction } from "../../store/dataSlice";

const UserNav = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutHandler = () => {
    dispatch(authAction.logout());
    dispatch(tokenAction.deleteToken());
    dispatch(dataAction.deleleData());
    Swal.fire("Sign out successfully", "Good bye", "success");
  };

  const viewUserProfile = () => {
    history.push("/profile");
  };

  return (
    <div className="grid grid-cols-2 divide-x-2 divide-white text-white text-right pt-1 md:pt-3 lg:pr-6 xl:pr-10">
      <div
        className="cursor-pointer hover:text-blue-400 pr-2 text-base sm:text-lg sm:pr-3 md:text-base sm:pr-1 lg:font-semibold lg:text-2xl xl:pr-6"
        onClick={viewUserProfile}
      >
        Profile
      </div>
      <div
        className="cursor-pointer hover:text-blue-400 pl-2 text-base sm:text-lg sm:pl-3 md:text-base sm:pl-1 lg:font-semibold lg:text-2xl xl:pl-6"
        onClick={logoutHandler}
      >
        Sign out
      </div>
    </div>
  );
};

export default UserNav;
