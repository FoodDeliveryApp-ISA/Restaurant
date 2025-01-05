import React, { useState, useEffect } from "react";
import { Upload, Button, message, Spin, Progress, Modal } from "antd";
import ImgCrop from "antd-img-crop";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log("Avatar URL:", avatarUrl);
    if (avatarUrl) {
      setImageUrl(avatarUrl); // Set image URL from props on initial render
    }
  }, [avatarUrl]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    Modal.confirm({
      title: "Confirm Upload",
      content: "Are you sure you want to upload this image?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          setIsActive(true);
          const rawFile = file.originFileObj || file;
          const key = `menus/${rawFile.name}`;
          const publicURL = `${publicDomain}/${key}`;

          await imageService.uploadImage(key, rawFile, rawFile.type);
          await onUpdate(publicURL); // Update image URL in parent component
          setImageUrl(publicURL); // Update local state
          message.success(`${rawFile.name} uploaded successfully!`);
          onSuccess("File uploaded successfully!");
        } catch (error) {
          message.error("Failed to upload image.");
          onError(error);
        } finally {
          setLoading(false);
          setIsActive(false);
        }
      },
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this image?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setImageUrl(null); // Remove image URL
        onUpdate(null); // Notify parent component
        message.success("Image deleted successfully!");
      },
    });
  };

  return (
    <div className="text-center">
      {imageUrl ? (
        <>
          <div
            className="relative inline-block mb-4"
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
          >
            <img
              src={imageUrl}
              alt="Menu Image"
              className="w-96 h-96 object-cover rounded-lg transition-transform transform hover:scale-105"
            />
            {showDelete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  className="bg-red-450 rounded-full border-2 border-white w-12 h-12 flex items-center justify-center transition-transform transform hover:scale-110"
                  onClick={handleDelete}
                  icon={<DeleteOutlined />}
                  size="large"
                  aria-label="Delete Image"
                />
              </div>
            )}
          </div>
          <ImgCrop rotate aspect={1}>
            <Upload
              showUploadList={false}
              accept="image/*"
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                disabled={loading || isActive}
                className="transition-transform transform hover:scale-105"
                aria-label="Update Image"
              >
                {loading ? <Spin /> : "Update Image"}
              </Button>
            </Upload>
          </ImgCrop>
          {loading && (
            <div className="mt-4">
              <Progress percent={100} size="small" />
            </div>
          )}
        </>
      ) : (
        <ImgCrop rotate aspect={1}>
          <Upload
            showUploadList={false}
            accept="image/*"
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            <button
              className="w-96 h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white transition-transform transform hover:scale-105"
              type="button"
              aria-label="Upload Image"
            >
              <PlusOutlined className="text-gray-400" />
              <div className="mt-2 text-gray-600">Upload Image</div>
            </button>
          </Upload>
        </ImgCrop>
      )}
    </div>
  );
};

export default MenuUpload;
