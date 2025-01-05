import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert, Typography } from "antd";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import MenuService from "../../../services/menu.service";

const { Title } = Typography;

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

  if (loading)
    return (
      <div style={styles.centeredContainer}>
        <Spin size="large" tip="Loading menu details..." />
      </div>
    );

  if (error)
    return (
      <div style={styles.centeredContainer}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  return (
    <div style={styles.container}>
      <Title level={3} style={styles.title}>
        Edit Menu
      </Title>
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} sm={24} md={10} lg={8}>
          <LeftSection menuId={menuId} />
        </Col>
        <Col xs={24} sm={24} md={14} lg={16}>
          <RightSection menu={menu} />
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minHeight: "100vh",
  },
  centeredContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
};

export default MenuEdit;
