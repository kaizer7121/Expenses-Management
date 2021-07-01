import { Fragment } from "react";
import { Link } from "react-router-dom";

import UserNav from "./UserNav";
import "./Navigation.css";

const Navigation = () => {
  return (
    <Fragment>
      <nav className="bg-color flex items-center justify-between bg-teal-500 p-4 md:p-6">
        <div
          className="flex cursor-pointer items-center flex-shrink-0 text-white md:mr-4 lg:mr-6"
          onClick={() => {}}
        >
          <Link
            to="/"
            className="sm:mr-4 md:mr-2 lg:mr-4 w-9/12 md:w-auto md:mr-4 lg:mr-6"
          >
            <img src="images/web-icon2.png" alt="logo" />
          </Link>
          <span className="font-semibold tracking-tight text-2xl md:text-3xl lg:text-4xl hidden md:inline-block">
            Expenses Management
          </span>
        </div>
        <div className="block flex-grow lg:flex lg:items-center w-2/12  md:mt-2 lg:mt-2">
          <div className="text-sm lg:flex-grow ">
            <p
              className="text-base cursor-pointer text-teal-200 hover:text-blue-400 mr-3 text-white sm:mr-4 md:ml-. md:mr-0 lg:inline-block lg:mt-0 sm:text-lg sm:text-2xl md:text-xl lg:text-2xl"
              onClick={() => {}}
            >
              Manage member
            </p>
          </div>
        </div>

        <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <UserNav />
        </div>
      </nav>
    </Fragment>
  );
};

export default Navigation;
