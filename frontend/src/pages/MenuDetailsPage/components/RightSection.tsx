import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Spin } from "antd";
import { useParams } from "react-router-dom";
import MenuService from "../../../services/menu.service";
import { MenuDto, RequestUpdatedMenuDto } from "../../../services/dto/menu.dto";

const RightSection: React.FC = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const [menuData, setMenuData] = useState<MenuDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false); // Track edit mode
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility
  const [form] = Form.useForm(); // Use Form instance for resetting

  useEffect(() => {
    if (!menuId) return;

    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const data = await MenuService.getMenuById(parseInt(menuId, 10));
        setMenuData(data);
      } catch (error) {
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
      message.success("Menu updated successfully!");
    } catch (error) {
      message.error("Failed to update menu.");
    } finally {
      setLoading(false);
      setEditMode(false); // After saving, return to view mode
    }
  };

  const handleSaveChanges = () => {
    setIsModalVisible(true); // Show confirmation modal before saving
  };

  const handleOk = (values: RequestUpdatedMenuDto) => {
    setIsModalVisible(false);
    handleUpdate(values); // Proceed with the update if confirmed
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close modal without saving
  };

  const handleCancelEdit = () => {
    form.resetFields(); // Reset form to initial values
    setEditMode(false); // Disable edit mode
  };

  if (!menuData) {
    return (
      <div className="flex justify-center items-center h-screen">
        {loading ? (
          <Spin size="large" />
        ) : (
          <p className="text-xl">Menu data not found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Edit Menu Item
      </h1>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          menuName: menuData.menuName,
          menuDescription: menuData.menuDescription,
        }}
        onFinish={handleSaveChanges}
        className="space-y-6"
      >
        <Form.Item
          label="Menu Name"
          name="menuName"
          rules={[{ required: true, message: "Please enter a menu name!" }]}
          className="text-gray-700"
        >
          <Input
            placeholder="Enter menu name"
            className="border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            disabled={!editMode} // Disable input when not in edit mode
          />
        </Form.Item>

        <Form.Item
          label="Menu Description"
          name="menuDescription"
          rules={[{ required: true, message: "Please enter a description!" }]}
          className="text-gray-700"
        >
          <Input.TextArea
            placeholder="Enter menu description"
            className="border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            rows={4}
            disabled={!editMode} // Disable textarea when not in edit mode
          />
        </Form.Item>

        {/* Buttons: Edit/Save/Cancel */}
        <div className="flex justify-between items-center">
          {!editMode && (
            <Button
              type="primary"
              onClick={() => setEditMode(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition duration-300"
            >
              Edit
            </Button>
          )}
          {editMode && (
            <>
              <Button
                type="default"
                onClick={handleCancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg transition duration-300"
              >
                Cancel Edit
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition duration-300"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </Form>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Changes"
        visible={isModalVisible}
        onOk={() => handleOk(form.getFieldsValue() as RequestUpdatedMenuDto)} // Pass current form values for saving
        onCancel={handleCancel}
        okText="Yes, Save Changes"
        cancelText="No, Cancel"
      >
        <p>Are you sure you want to save the changes?</p>
      </Modal>
    </div>
  );
};

export default RightSection;
