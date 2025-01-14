import {
    CheckCircleOutlined,
    FireOutlined,
    SearchOutlined,
    CarOutlined,
    SmileOutlined,
  } from "@ant-design/icons";
  
  export const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "check-circle":
        return <CheckCircleOutlined />;
      case "fire":
        return <FireOutlined />;
      case "search":
        return <SearchOutlined />;
      case "car":
        return <CarOutlined />;
      case "smile":
        return <SmileOutlined />;
      default:
        return null;
    }
  };
  