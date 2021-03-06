import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePermissionOfUser,
  randomString,
  updateDataToFireStore,
} from "../../action/Action";
import { db } from "../../Firebase";

const PermissionNotification = () => {
  const [secretCode, setSecretCode] = useState("");
  const [notification, setNotification] = useState("");
  const [trueSecretCode, setTrueSecretCode] = useState("");

  const userInfo = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("SecretCode")
      .doc("SecretCode")
      .onSnapshot((doc) => {
        if (doc.data() && doc.data().secretCode) {
          setTrueSecretCode(doc.data().secretCode);
        }
      });
  }, []);

  const changeCodeHandler = (event) => {
    const value = event.target.value;
    setNotification("");
    setSecretCode(value);
  };

  const submitCodeHandler = () => {
    if (secretCode.length === 0) {
      setNotification("The code can't be empty");
    } else {
      if (secretCode === trueSecretCode) {
        const id = randomString(20);
        updateDataToFireStore("ListUser", id, {
          id,
          userID: db.collection("Users").doc(userInfo.userID),
        });
        changePermissionOfUser(true, dispatch);
      } else {
        setNotification("The code is not correct!");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" space-y-8 ">
        <div className="md:max-w-md w-full lg:max-w-full">
          <img
            className="mx-auto w-auto h-20 sm:h-24 lg:h-32 lg:mt-12"
            src="images/sad-face.png"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center font-extrabold text-gray-900 text-lg sm:text-2xl lg:text-4xl lg:mt-12 text-yellow-500">
            Sorry your account don't have permission to use this web
          </h2>
        </div>
        <div className="mt-12 space-y-6 text-center">
          <div className="pt-2 sm:pt-4 lg:pt-8 xl:pt-16">
            <p className="text-sm sm:text-base lg:text-lg">
              Wait for admin or you can insert the{" "}
              <span className="font-bold text-red-500">secret code</span> to use
              the website
            </p>
          </div>
          <div className="rounded-md space-y-2 max-w-md mx-auto">
            <div>
              <input
                type="text"
                className="appearance-none rounded-none relative inline-block w-9/12 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 xs+:text-sm"
                placeholder="Code"
                value={secretCode}
                onChange={changeCodeHandler}
              />
              <button
                onClick={submitCodeHandler}
                className="xs+:ml-8 group relative inline-flex w-3/12 xs+:w-2/12 justify-center py-3 xs+:py-2 px-1 border border-transparent text-xs font-medium rounded-sm text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              {/* {!lockSend ? (
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
                )} */}
            </div>
            <div className="px-2 text-left">
              <p className="text-red-500">{notification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionNotification;
