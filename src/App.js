import Auth from "./pages/Auth";
import Members from "./pages/Members";
import ProfileUser from "./pages/ProfileUser";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Fragment } from "react";
import { authAction } from "./store/authSlice";
import { tokenAction } from "./store/tokenSlice";
import firebase from "firebase";
import { getPaymentMethods, getSingleDataFromFireStore } from "./action/Action";
import Test from "./components/test/test";
import { dataAction } from "./store/dataSlice";
import Bills from "./pages/Bills";

function App() {
  const token = useSelector((state) => state.token.token);
  const expirationTime = useSelector((state) => state.token.expirationTime);
  const dispatch = useDispatch();

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
          const userInfo = await getSingleDataFromFireStore("Users", userID);
          getPaymentMethods(userID, dispatch);
          dispatch(authAction.login(userInfo));
          dispatch(tokenAction.addToken({ token, expirationTime }));
        } else {
          console.log("User data is null!");
        }
      });
    }
  }, [token, dispatch, expirationTime]);

  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <Bills />
        </Route>
        <Route path="/SignIn">{token ? <Redirect to="/" /> : <Auth />}</Route>
        <Route path="/profile">
          {token ? <ProfileUser /> : <Redirect to="/SignIn" />}
        </Route>
        <Route path="/Test">
          <Test />
        </Route>
        <Route path="/members">
          {!token ? <Redirect to="/SignIn" /> : <Members />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
