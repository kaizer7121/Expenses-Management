import Auth from "./pages/Auth";
import Members from "./pages/Members";
import { Switch, Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authAction } from "./store/authSlice";
import { tokenAction } from "./store/tokenSlice";
import firebase from "firebase";
import { getSingleDataFromFireStore } from "./action/Action";
import Test from "./components/test/test";

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
    } else {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const expirationTime = user.h.c;
          const token = user.Aa;
          const userID = user.uid;
          const userInfo = await getSingleDataFromFireStore("Users", userID);
          dispatch(authAction.login(userInfo));
          dispatch(tokenAction.addToken({ token, expirationTime }));
        } else {
          console.log("User data is null!");
        }
      });
    }
  }, [token, dispatch, expirationTime]);

  return (
    <Switch>
      <Route path="/" exact>
        {token ? <Members /> : <Redirect to="/SignIn" />}
      </Route>
      <Route path="/SignIn">{token ? <Redirect to="/" /> : <Auth />}</Route>
      <Route path="/Test">{token ? <Redirect to="/" /> : <Auth />}</Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
