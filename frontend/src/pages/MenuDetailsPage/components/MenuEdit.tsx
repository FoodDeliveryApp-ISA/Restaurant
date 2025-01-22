import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert, Typography, Card } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import MenuService from "../../../services/menu.service";

const { Title, Text } = Typography;

interface MenuEditProps {
  menuId: number;
}

const MenuEdit: React.FC<MenuEditProps> = ({ menuId }) => {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await MenuService.getMenuById(menuId);
        if (!response) throw new Error("Menu data not found.");
        setMenu(response);
      } catch (err: any) {
        setError(err.message || "Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      fetchMenu();
    } else {
      setError("Menu ID is required.");
      setLoading(false);
    }
  }, [menuId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading menu details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div>
      <div
        // style={{
        //   margin: "0 auto",
        //   maxWidth: "1200px",
        //   borderRadius: "8px",
        //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        // }}
        // bodyStyle={{ padding: "24px" }}
      >
        {/* <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
          Edit Menu
        </Title> */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={10} lg={8}>
            <Card
              title={<Text strong>Change Profile and Status</Text>}
              bordered
              bodyStyle={{ padding: "16px" }}
            >
              <LeftSection menuId={menuId} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={14} lg={16}>
            <Card
              title={<Text strong>Edit Menu Details</Text>}
              bordered
              bodyStyle={{ padding: "16px" }}
            >
              <RightSection menu={menu} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MenuEdit;
