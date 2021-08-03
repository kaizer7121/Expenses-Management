import Auth from "./pages/Auth";
import Members from "./pages/Members";
import ProfileUser from "./pages/ProfileUser";
import { Switch, Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Fragment } from "react";
import { authAction } from "./store/authSlice";
import { tokenAction } from "./store/tokenSlice";
import firebase from "firebase";
import {
  findDataFromFireStore,
  getPaymentMethods,
  getSingleDataFromFireStore,
  checkPermissionUsersListener,
} from "./action/Action";
import Test from "./components/test/test";
import { dataAction } from "./store/dataSlice";
import Bills from "./pages/Bills";
import Notification from "./pages/Notification";
import { db } from "./Firebase";
import Loading from "./components/Loading/Loading";

function App() {
  const token = useSelector((state) => state.token.token);
  const expirationTime = useSelector((state) => state.token.expirationTime);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Effect: ");
    const currentTime = new Date().getTime() + 60000;
    if (!token || expirationTime <= currentTime) {
      console.log("TIMEOUT");
      dispatch(authAction.logout());
      dispatch(tokenAction.deleteToken());
      dispatch(dataAction.deleleData());
    } else {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const expirationTime = user.h.c;
          const token = user.Aa;
          const userID = user.uid;
          let userInfo = await getSingleDataFromFireStore("Users", userID);

          let checkPermission = "";
          const data = await findDataFromFireStore(
            "ListUser",
            "userID",
            "==",
            db.collection("Users").doc(userID)
          );

          checkPermission = data.length > 0;
          userInfo = { ...userInfo, permission: checkPermission };
          await getPaymentMethods(userID, dispatch);
          dispatch(authAction.login(userInfo));
          dispatch(tokenAction.addToken({ token, expirationTime }));
          checkPermissionUsersListener(userInfo.userID, dispatch);
        } else {
          console.log("User data is null!");
        }
      });
    }
  }, [token, dispatch, expirationTime]);

  return (
    <Fragment>
      {!token && (
        <Switch>
          <Route path="/Signin">{token ? <Redirect to="/" /> : <Auth />}</Route>
          <Route path="*">
            <Redirect to="/Signin" />
          </Route>
        </Switch>
      )}
      {token && userInfo.permission === "" && (
        <Switch>
          <Route path="/">
            <Loading />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
      {token && userInfo.permission !== "" && userInfo.name === "" && (
        <Switch>
          <Route path="/profile">
            <ProfileUser />
          </Route>
          <Route path="*">
            <Redirect to="/profile" />
          </Route>
        </Switch>
      )}
      {token &&
        userInfo.permission !== "" &&
        userInfo.name !== "" &&
        userInfo.permission === false && (
          <Switch>
            <Route path="/profile">
              <ProfileUser />
            </Route>
            <Route path="/notification">
              <Notification />
            </Route>
            <Route path="*">
              <Redirect to="/notification" />
            </Route>
          </Switch>
        )}
      {token &&
        userInfo.permission !== "" &&
        userInfo.name !== "" &&
        userInfo.permission === true && (
          <Switch>
            <Route path="/test" exact>
              <Test />
            </Route>
            <Route path="/" exact>
              <Bills />
            </Route>
            <Route path="/profile">
              <ProfileUser />
            </Route>
            <Route path="/members">
              <Members />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        )}
    </Fragment>
  );
}

export default App;
