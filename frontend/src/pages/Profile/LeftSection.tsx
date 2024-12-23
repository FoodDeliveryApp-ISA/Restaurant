import React, { useState } from "react";
import { Card, Upload, Button, Switch, message, Space } from "antd";
import { UploadOutlined, SaveOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";

const LeftSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [active, setActive] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      setProfilePic(URL.createObjectURL(info.file.originFileObj));
      message.success(`${info.file.name} uploaded successfully!`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const handleSave = () => {
    message.success("Profile picture and status saved successfully!");
    toggleEdit();
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "10px",
        padding: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
        Profile Picture & Status
      </h3>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {/* Rectangular Profile Picture */}
        <img
          src={profilePic || "https://via.placeholder.com/400x200"}
          alt="Profile"
          style={{
            width: "400px",
            height: "200px",
            objectFit: "cover", // Ensures the image is properly cropped
            marginBottom: "15px",
            border: "3px solid #1890ff",
            borderRadius: "10px", // Keeps it rectangular with rounded corners
          }}
        />
        <Upload
          showUploadList={false}
          accept="image/*"
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => onSuccess && onSuccess("ok"), 0);
          }}
          onChange={handleUpload}
          disabled={!isEditing}
        >
          <Button
            icon={<UploadOutlined />}
            disabled={!isEditing}
          >
            Upload Picture
          </Button>
        </Upload>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p>Status: {active ? "Active" : "Inactive"}</p>
        <Switch
          checked={active}
          onChange={(checked) => setActive(checked)}
          disabled={!isEditing}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        {isEditing ? (
          <Space>
            <Button
              type="primary"
              onClick={handleSave}
              icon={<SaveOutlined />}
            >
              Save Changes
            </Button>
            <Button
              onClick={toggleEdit}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Button
            onClick={toggleEdit}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
};

export default LeftSection;
