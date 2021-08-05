import { Fragment, useEffect, useState } from "react";
import firebase, { db } from "../../Firebase";

import Swal from "sweetalert2";
import {
  findDataFromFireStore,
  getSingleDataFromFireStore,
  updateDataToFireStore,
} from "../../action/Action";
import { useDispatch } from "react-redux";
import { authAction } from "../../store/authSlice";
import { tokenAction } from "../../store/tokenSlice";

let downloadTimer;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVeriticationCode] = useState("");
  const [isSendCode, setIsSendCode] = useState(false);
  const [lockSend, setLockSend] = useState(false);
  const [lockSubmit, setLockSubmit] = useState(false);
  const [countdown, setCountdown] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    let timeout;
    if (countdown > 0) {
      timeout = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    countdown === 0 && setLockSend(false);

    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [countdown]);

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      }
    );
  };

  const convertPhoneNumber = (phoneNum) => {
    let convertedPhoneNumber = phoneNum;
    if (convertedPhoneNumber.charAt(0) === "0") {
      convertedPhoneNumber = convertedPhoneNumber.substring(1);
    }
    if (convertedPhoneNumber.includes("+840")) {
      convertedPhoneNumber = convertedPhoneNumber.substring(4);
    }
    if (!convertedPhoneNumber.includes("+84", 0)) {
      convertedPhoneNumber = `+84${convertedPhoneNumber}`;
    }
    return convertedPhoneNumber;
  };

  const sendCodeThroughSMS = () => {
    setLockSend(true);
    setCountdown(30);

    setUpRecaptcha();
    const userPhoneNumber = convertPhoneNumber(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(userPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        // console.log(confirmationResult);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setIsSendCode(true);
        // ...
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Opps", "Something wrong in your phone number", "error").then(
          () => {
            window.location.reload();
          }
        );
        setLockSend(false);
        clearInterval(downloadTimer);
      });
  };

  const addPhoneNumHandler = (event) => {
    if (event) {
      const phoneNumber = event.target.value;
      setPhoneNumber(phoneNumber);
    }
  };

  const addVeriCodeHandler = (event) => {
    const code = event.target.value;
    setVeriticationCode(code);
  };

  const confirmCodeAndSignIn = () => {
    const code = verificationCode.length > 0 ? verificationCode : " ";
    setLockSubmit(true);
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        const user = result.user;
        const uid = user.uid;
        let userData = await getSingleDataFromFireStore("Users", uid);
        if (!userData) {
          updateDataToFireStore("Users", uid, {
            userID: uid,
            phone: user.phoneNumber,
            name: "",
            debt: 0,
            role: "User",
          });
          const newUserData = {
            userID: uid,
            phone: user.phoneNumber,
            name: "",
            debt: 0,
            permission: false,
            role: "User",
          };
          setCountdown(0);
          Swal.fire("Sign in successfully", "", "success").then(() => {
            const expirationTime = user.h.c;
            const token = user.Aa;
            setCountdown(0);
            dispatch(authAction.login(newUserData));
            dispatch(tokenAction.addToken({ token, expirationTime }));
          });
        } else {
          const data = await findDataFromFireStore(
            "ListUser",
            "userID",
            "==",
            db.collection("Users").doc(userData.userID)
          );
          const checkPermission = data.length > 0;
          userData = { ...userData, permission: checkPermission };
          setCountdown(0);
          Swal.fire("Sign in successfully", "", "success").then(() => {
            const expirationTime = user.h.c;
            const token = user.Aa;
            setCountdown(0);
            dispatch(authAction.login(userData));
            dispatch(tokenAction.addToken({ token, expirationTime }));
          });
        }
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        console.log(error);
        dispatch(authAction.logout());
        dispatch(tokenAction.deleteToken());
        Swal.fire(
          "Opps",
          "Your verification code is not correct",
          "error"
        ).then(() => {
          window.location.reload();
        });
        // ...
      });
  };

  return (
    <Fragment>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-20 w-auto"
              src="images/web-icon2.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <input
                  name="phoneNumber"
                  type="text"
                  required
                  className="appearance-none rounded-none relative inline-block w-9/12 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={addPhoneNumHandler}
                />
                {!lockSend ? (
                  <button
                    onClick={sendCodeThroughSMS}
                    className="sm:ml-8 group relative inline-flex w-3/12 sm:w-2/12 justify-center py-3 sm:py-2 px-1 border border-transparent text-xs font-medium rounded-sm text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send code
                  </button>
                ) : (
                  <button
                    onClick={sendCodeThroughSMS}
                    className="sm:ml-8 group relative inline-flex w-3/12 sm:w-2/12 justify-center py-3 sm:py-2 px-1 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-600 cursor-not-allowed"
                    disabled
                  >
                    Wait {countdown}s
                  </button>
                )}
              </div>
              {isSendCode && (
                <div>
                  <input
                    name="verificationCode"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Verification code"
                    value={verificationCode}
                    onChange={addVeriCodeHandler}
                  />
                </div>
              )}
            </div>
            {isSendCode && !lockSubmit && (
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={confirmCodeAndSignIn}
                >
                  Sign in
                </button>
              </div>
            )}
            {isSendCode && lockSubmit && (
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 cursor-wait"
                  onClick={() => {}}
                >
                  <img
                    src="images/Rolling-1s-51px.png"
                    alt="loading"
                    className="animate-spin h-5 w-5 mr-3 bg-opacity-0	"
                  />
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </Fragment>
  );
};

export default Login;
