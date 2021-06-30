const UserNav = () => {
  const auth = false;

  return (
    <div className="grid grid-cols-2 divide-x-2 divide-white text-white text-right pt-1 md:pt-3 lg:pr-6 xl:pr-10" >
      <div className="cursor-pointer hover:text-blue-400 pr-2 text-base sm:text-lg sm:pr-3 md:text-base sm:pr-1 lg:font-semibold lg:text-2xl xl:pr-6">Profile</div>
      <div className="cursor-pointer hover:text-blue-400 pl-2 text-base sm:text-lg sm:pl-3 md:text-base sm:pl-1 lg:font-semibold lg:text-2xl xl:pl-6">Logout</div>
    </div>
  );
};

export default UserNav;
