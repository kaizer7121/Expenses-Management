import { useState } from "react";
const DUMMY_DATA = [
  { id: 1, name: "Đào Hữu Đức", phone: "0703431760", debt: 200000 },
  { id: 2, name: "Trần Văn A", phone: "0913431760", debt: 550000 },
  { id: 3, name: "Nguyễn Nhật Huy", phone: "0984131760", debt: 800000 },
];

const ManageMember = () => {
  const [arrayValue, setArrayValue] = useState(DUMMY_DATA);
  const [idKey, setIdKey] = useState(arrayValue.length);
  const [{ inputName, inputPhone }, setInputValue] = useState({
    inputName: "",
    inputPhone: "",
  });
  const [notification, setNotification] = useState("");

  const changeValueHandler = (event) => {
    const target = event.target.name.split(" ");
    const targetedName = target[0];
    const targetedId = target[1];
    const targetedContent = event.target.value;
    setArrayValue((prevValue) => {
      const selectedIndex = prevValue.findIndex((el) => el.id == targetedId);
      const selectedObject = prevValue[selectedIndex];
      prevValue[selectedIndex] = {
        ...selectedObject,
        [targetedName]: targetedContent,
      };
      return [...prevValue];
    });
  };

  const removeUserHandler = (event) => {
    const targetedId = event.target.name;
    setArrayValue((prevValue) => {
      const selectedIndex = prevValue.findIndex((el) => el.id == targetedId);
      prevValue.splice(selectedIndex, 1);
      return [...prevValue];
    });
    setIdKey((prevValue) => prevValue - 1);
  };

  const inputValueHandler = (event) => {
    const type = event.target.name;
    const content = event.target.value;
    setInputValue((prevValue) => {
      return { ...prevValue, [type]: content };
    });
    setNotification("");
  };

  const addUserHandler = () => {
    if (inputName.length === 0 || inputPhone.length === 0) {
      setNotification("Name and phone must not be empty");
    } else {
      setIdKey((prevValue) => prevValue + 1);
      const newUser = {
        id: idKey + 1,
        name: inputName,
        phone: inputPhone,
        debt: 0,
      };
      setArrayValue((prevValue) => {
        return [...prevValue, newUser];
      });
      setInputValue({ inputName: "", inputPhone: "" });
    }
  };

  return (
    <div className="">
      <div className="mt-12 lg:mt-16 border-b w-5/12 text-2xl font-semibold mb-8 sm:w-4/12 sm:text-3xl md:text-3xl md:4/12 lg:text-4xl lg:mx-16 lg:w-3/12 2xl:w-2/12">
        <h1>List member</h1>
      </div>
      <table className="table-fixed border-collapse text-center lg:mx-16">
        <thead>
          <tr>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Name</div>
            </th>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Phone</div>
            </th>
            <th className="border-b border-black text-base w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Debt</div>
            </th>
            <th className="border-b border-black text-base w-1/12 sm:w-screen pb-2 sm:text-lg  sm:pb-4 md:pb-8 lg:pb-12 md:text-2xl lg:w-screen">
              <div>Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {arrayValue.map((el, index) => {
            return (
              <tr key={el.id}>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl self-center py-2 lg:py-8">
                  <textarea
                    rows="1"
                    onChange={changeValueHandler}
                    name={`name ${el.id}`}
                    className="text-center w-full resize-y"
                    value={arrayValue[index].name}
                  />
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                  <input
                    onChange={changeValueHandler}
                    id={el.id}
                    name={`phone ${el.id}`}
                    className="text-center w-full"
                    value={arrayValue[index].phone}
                  />
                </td>
                <td className="border-b border-black text-xs sm:text-lg md:text-xl py-2 lg:py-8">
                  {el.debt.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td className="border-b border-black py-2 lg:py-4">
                  <img
                    name={el.id}
                    className="mx-auto h-5 sm:h-8 md:h-10 m-4 cursor-pointer"
                    src="images/cancel.png"
                    alt="Workflow"
                    onClick={removeUserHandler}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="text-xs sm:text-lg md:text-xl py-2 lg:py-8">
              <textarea
                rows="1"
                name="inputName"
                className="placeholder-gray-500 text-center w-full"
                placeholder="Name"
                value={inputName}
                onChange={inputValueHandler}
              />
            </td>
            <td className="text-xs sm:text-lg md:text-xl py-2 lg:py-8">
              <input
                name="inputPhone"
                className="placeholder-gray-500 text-center w-full"
                placeholder="Phone"
                value={inputPhone}
                onChange={inputValueHandler}
              />
            </td>
            <td className="text-gray-500 text-sm sm:text-lg md:text-xl py-2 lg:py-8">
              (0 VND)
            </td>
            <td className="py-2 lg:py-4">
              <img
                className="mx-auto h-5 sm:h-8 md:h-10 w-auto m-4 cursor-pointer"
                src="images/plus.png"
                alt="Workflow"
                onClick={addUserHandler}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {notification && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative "
          role="alert"
        >
          <span class="absolute inset-y-0 left-0 flex items-center ml-4">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </span>
          <p class="ml-6">{notification}</p>
          
        </div>
      )}
    </div>
  );
};

export default ManageMember;
