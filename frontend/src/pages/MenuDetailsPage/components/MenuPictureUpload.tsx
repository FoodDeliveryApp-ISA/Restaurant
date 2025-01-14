import React, { useState, useEffect } from "react";
import { Upload, Button, message, Spin, Progress, Modal } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageService from "../../../services/image.service";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onUpdate: (url: string | null) => Promise<void>;
}

const MenuUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, onUpdate }) => {
  const bucketName = "delivery";
  const publicDomain = "https://pub-363dbd684ef24c85941b635a63222f54.r2.dev";
  const imageService = new ImageService(bucketName, publicDomain);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(avatarUrl);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    setImageUrl(avatarUrl || null);
  }, [avatarUrl]);

  const beforeUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 >= 2) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      setLoading(true);
      const rawFile = file.originFileObj || file;
      const key = `menus/${rawFile.name}`;
      const publicURL = `${publicDomain}/${key}`;

      await imageService.uploadImage(key, rawFile, rawFile.type);
      await onUpdate(publicURL);
      setImageUrl(publicURL);
      message.success("Image uploaded successfully!");
      onSuccess("File uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload image.");
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this image?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        setImageUrl(null);
        await onUpdate(null);
        message.success("Image deleted successfully!");
      },
    });
  };

  return (
    <div className="text-center">
      {imageUrl ? (
        <div
          className="relative inline-block mb-4"
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
        >
          <img
            src={imageUrl}
            alt="Menu Image"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          {showDelete && (
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              size="large"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={handleDelete}
              aria-label="Delete Image"
            />
          )}
        </div>
      ) : (
        <ImgCrop rotate aspect={1}>
          <Upload
            showUploadList={false}
            accept="image/*"
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer">
              <PlusOutlined style={{ fontSize: "24px", color: "#8c8c8c" }} />
              <p className="mt-2 text-gray-500">Upload Image</p>
            </div>
          </Upload>
        </ImgCrop>
      )}
      {imageUrl && (
        <ImgCrop rotate aspect={1}>
          <Upload
            showUploadList={false}
            accept="image/*"
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            <Button
              icon={<UploadOutlined />}
              type="primary"
              style={{ marginTop: "16px" }}
              disabled={loading}
              loading={loading}
            >
              Update Image
            </Button>
          </Upload>
        </ImgCrop>
      )}
      {loading && (
        <div style={{ marginTop: "16px" }}>
          <Progress percent={100} status="active" />
        </div>
      )}
    </div>
  );
};

export default MenuUpload;
