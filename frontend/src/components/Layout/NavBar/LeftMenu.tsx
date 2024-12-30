import React from "react";

const LeftMenu = ({ mode }) => {
  return (
    <ul
      className={`${
        mode === "horizontal" ? "flex gap-4" : "flex flex-col gap-2"
      } text-white`}
    >
      {/* <li className="hover:text-blue-500 cursor-pointer">Explore</li>
      <li className="hover:text-blue-500 cursor-pointer">Features</li>
      <li className="hover:text-blue-500 cursor-pointer">About Us</li>
      <li className="hover:text-blue-500 cursor-pointer">Contact Us</li> */}
    </ul>
  );
};

export default LeftMenu;
