import React from "react";
import { Tabs } from "antd";
import Login from "../Login/Login";
import Register from "../Register/Register";
import styles from "./LoginRegister.module.css"; // Import CSS module
import loginImage from "../../assets/images/login1.jpg"; // Import the image

const { TabPane } = Tabs;

const LoginRegister: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* Left half with the image, hidden on mobile */}
      <div className="lg:h-full lg:w-4/5 hidden lg:block relative">
        {" "}
        {/* Add relative positioning here */}
        <img
          className="h-full w-full object-cover"
          src={loginImage}
          alt="login-image"
        />
        {/* Text on top of the image */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold">
          <h2 className="text-6xl font-semibold text-center mb-6">
            Unlock a new revenue stream
          </h2>
        </div>
      </div>

      {/* Right half for login/register tabs */}
      <div className="h-full w-full lg:w-1/2 flex justify-center items-start mt-40">
        <div className="w-[450px] h-auto flex flex-col justify-start bg-white text-black shadow-lg rounded-lg p-6 border-t-4 border-black">
          {/* Box with white background, black text, shadow, rounded corners, and black top border */}

          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Register" key="1">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Get Started
              </h2>
              <Register />
            </TabPane>
            <TabPane tab="Login" key="2">
              {/* Added margin top to avoid overlapping with form */}
              <h2 className="text-2xl font-semibold text-center mb-6">
                Welcome Back!
              </h2>
              <Login />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
