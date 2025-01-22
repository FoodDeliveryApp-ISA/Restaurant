import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Spin, Typography } from "antd";
import { useParams } from "react-router-dom";
import MenuService from "../../../services/menu.service";
import { MenuDto, RequestUpdatedMenuDto } from "../../../services/dto/menu.dto";

const { Title, Text } = Typography;

const RightSection: React.FC = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const [menuData, setMenuData] = useState<MenuDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!menuId) return;

    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const data = await MenuService.getMenuById(parseInt(menuId, 10));
        setMenuData(data);
      } catch {
        message.error("Failed to fetch menu details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [menuId]);

  const handleUpdate = async (values: RequestUpdatedMenuDto) => {
    try {
      if (!menuId) return;
      setLoading(true);
      await MenuService.updateMenu(parseInt(menuId, 10), values);
      setMenuData((prev) => ({ ...prev, ...values }));
      message.success("Menu updated successfully!");
    } catch {
      message.error("Failed to update menu.");
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  const handleSaveChanges = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const values = form.getFieldsValue();
    setIsModalVisible(false);
    handleUpdate(values as RequestUpdatedMenuDto);
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setEditMode(false);
  };

  if (!menuData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        {loading ? <Spin size="large" /> : <Text type="danger">Menu data not found.</Text>}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px"}}>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          menuName: menuData.menuName,
          menuDescription: menuData.menuDescription,
        }}
        onFinish={handleSaveChanges}
      >
        <Form.Item
          label="Menu Name"
          name="menuName"
          rules={[{ required: true, message: "Please enter a menu name!" }]}
        >
          <Input placeholder="Enter menu name" disabled={!editMode} />
        </Form.Item>

        <Form.Item
          label="Menu Description"
          name="menuDescription"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea placeholder="Enter menu description" rows={4} disabled={!editMode} />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: editMode ? "space-between" : "center", marginTop: "16px" }}>
          {!editMode ? (
            <Button type="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </Form>

      <Modal
        title="Confirm Changes"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes, Save Changes"
        cancelText="No, Cancel"
      >
        <Text>Are you sure you want to save the changes?</Text>
      </Modal>
    </div>
  );
};

export default RightSection;
