import { Fragment } from "react";
import { Link } from "react-router-dom";

import "./Navigation.css";

const Navigation = () => {
  return (
    <Fragment>
      <nav className="bg-color flex items-center justify-between flex-wrap bg-teal-500 p-4 md:p-6">
        <div
          className="flex cursor-pointer items-center flex-shrink-0 text-white md:mr-4 lg:mr-6\"
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
        <div className="block flex-grow lg:flex lg:items-center lg:w-auto md:mt-2 lg:mt-2">
          <div className="text-sm lg:flex-grow ">
            <p
              className="cursor-pointer text-teal-200 hover: mr-4 text-white block md:ml-6 lg:inline-block lg:mt-0 text-lg sm:text-2xl md:text-xl lg:text-2xl"
              onClick={() => {}}
            >
              Manage member
            </p>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="grid grid-cols-3 divide-x divide-green-500">
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navigation;
