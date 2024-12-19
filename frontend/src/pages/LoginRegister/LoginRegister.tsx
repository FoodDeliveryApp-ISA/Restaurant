import React from "react";
import { Tabs } from "antd";
import RestaurantLogin from "../Login/Login";
import RestaurantRegister from "../Register/Register";
import loginImage from "../../assets/images/login3.jpg";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

const LoginRegister: React.FC = () => {
  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row relative bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Left Half with Image and Overlay */}
      <motion.div
        className="relative lg:h-full lg:w-4/5 hidden lg:block"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
        <img
          className="h-full w-full object-cover"
          src={loginImage}
          alt="login"
        />
        {/* Centered Text */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center"
          variants={textVariants}
        >
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            Empower Your Future
          </h2>
          <p className="text-lg font-light">Join us to start your journey.</p>
        </motion.div>
      </motion.div>

      {/* Right Half with Tabs */}
      <motion.div
        className="h-full w-full lg:w-1/2 flex justify-center items-center"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="w-[90%] sm:w-[450px] bg-white rounded-3xl shadow-lg p-8 border-t-4 border-blue-500">
          {/* Tabs for Login and Register */}
          <Tabs
            defaultActiveKey="1"
            centered
            tabBarStyle={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#555",
            }}
          >
            <TabPane tab="Register" key="1">
              <motion.h2
                className="text-2xl font-bold text-center mb-6 text-blue-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Create Your Account
              </motion.h2>
              <RestaurantRegister/>
            </TabPane>
            <TabPane tab="Login" key="2">
              <motion.h2
                className="text-2xl font-bold text-center mb-6 text-green-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Welcome Back!
              </motion.h2>
              <RestaurantLogin />
            </TabPane>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegister;


