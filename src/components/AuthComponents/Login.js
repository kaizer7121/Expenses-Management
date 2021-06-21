import { Fragment, useState } from "react";
import firebase from "../../Firebase";

import Swal from "sweetalert2";

let isRender = false;
var downloadTimer;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVeriticationCode] = useState("");
  const [isSendCode, setIsSendCode] = useState(false);
  const [lockSend, setLockSend] = useState(false);

  const setUpRecaptcha = () => {
    if (!isRender) {
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
      isRender = true;
    }
  };


  const sendCodeThroughSMS = () => {
    setLockSend(true);
    var timeleft = 30;
    downloadTimer = setInterval(function () {
      if (timeleft <= 0) {
        setLockSend(false);
        clearInterval(downloadTimer);
        console.log("End");
      } else {
        console.log(timeleft);
      }
      timeleft -= 1;
    }, 1000);

    setUpRecaptcha();
    const userPhoneNumber = phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    console.log(appVerifier);
    firebase
      .auth()
      .signInWithPhoneNumber(userPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        // console.log(confirmationResult);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log("Send successfully");
        setIsSendCode(true);
        // ...
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Opps", "Something wrong in your phone number", "error");
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
    const code = verificationCode;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        Swal.fire("Sign in successfully", "", "success");
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        Swal.fire("Opps", "Your verification code is not correct", "error");
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
                    Wait 30s
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
            {isSendCode && (
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
          </div>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </Fragment>
  );
};

export default Login;
