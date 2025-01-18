import React from "react";

const Plus = () => {
  return (
    <label
      className="has-[:checked]:shadow-lg w-full p-4  ease-in-out duration-300 border-solid bg-purple-400  group flex flex-row gap-3 items-center justify-center text-black rounded-full"
      htmlFor="messages"
    >
      <input
        id="messages"
        name="path"
        type="radio"
        className="hidden peer/expand absolute "
      />
      
      <svg
        width="25px"
        height="25px"
        viewBox="0 0 24 24"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
        className="w-26 h-26"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 12H20M12 4V20"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>
    </label>
  );
};

export default Plus;
