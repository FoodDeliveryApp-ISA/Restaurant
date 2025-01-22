import React, { useState } from "react";
import { Upload, Button, message, Spin, Progress, Modal } from "antd";
import ImgCrop from "antd-img-crop";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImageService from "../../../services/image.service";

interface ProfilePictureUploadProps {
  profilePic: string | null;
  onUpdate: (url: string) => Promise<void>;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePic,
  onUpdate,
}) => {
  const bucketName = "delivery";
  const publicDomain = "https://pub-363dbd684ef24c85941b635a63222f54.r2.dev";
  const imageService = new ImageService(bucketName, publicDomain);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(profilePic);
  const [showDelete, setShowDelete] = useState(false);

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
          const rawFile = file.originFileObj || file;
          const key = `profiles/${rawFile.name}`;
          const publicURL = `${publicDomain}/${key}`;

          await imageService.uploadImage(key, rawFile, rawFile.type);
          await onUpdate(publicURL);
          setImageUrl(publicURL);
          message.success(`${rawFile.name} uploaded successfully!`);
          onSuccess("File uploaded successfully!");
        } catch (error) {
          message.error("Failed to upload image.");
          onError(error);
        } finally {
          setLoading(false);
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
        setImageUrl(null);
        onUpdate(null);
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
              alt="Profile"
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
                disabled={loading}
                className="transition-transform transform hover:scale-105"
                aria-label="Update Profile Picture"
              >
                {loading ? <Spin /> : "Update Picture"}
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
              aria-label="Upload Profile Picture"
            >
              <PlusOutlined className="text-gray-400" />
              <div className="mt-2 text-gray-600">Upload</div>
            </button>
          </Upload>
        </ImgCrop>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
