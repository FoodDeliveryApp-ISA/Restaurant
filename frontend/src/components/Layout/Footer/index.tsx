// Footer/index.tsx
import React from "react";
import { CopyrightOutlined, GithubOutlined } from "@ant-design/icons";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterView: React.FC = () => (
  <Footer className="bg-black text-white p-6">
    <div className="container mx-auto flex flex-col items-center">
      <div className="flex space-x-6 mb-4">
        <a
          href="https://pro.ant.design"
          className="text-white hover:text-gray-400"
        >
          Ant Design Pro
        </a>
        <a
          href="https://github.com/ant-design/ant-design-pro"
          className="text-white hover:text-gray-400"
        >
          <GithubOutlined />
        </a>
        <a href="https://ant.design" className="text-white hover:text-gray-400">
          Ant Design
        </a>
      </div>
      <div className="text-center text-gray-500">
        Copyright <CopyrightOutlined /> 2023 Your Company
      </div>
    </div>
  </Footer>
);

export default FooterView;
