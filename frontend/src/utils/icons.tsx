import {
  InboxOutlined,
  FireOutlined,
  BoxPlotOutlined,
  UserOutlined,
  CarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export const getStepIcon = (iconName: string) => {
  switch (iconName) {
    case "InboxOutlined":
      return <InboxOutlined />;
    case "FireOutlined":
      return <FireOutlined />;
    case "BoxPlotOutlined":
      return <BoxPlotOutlined />;
    case "UserOutlined":
      return <UserOutlined />;
    case "CarOutlined":
      return <CarOutlined />;
    case "CheckCircleOutlined":
      return <CheckCircleOutlined />;
    case "DollarOutlined":
      return <DollarOutlined />;
    default:
      return null;
  }
};
