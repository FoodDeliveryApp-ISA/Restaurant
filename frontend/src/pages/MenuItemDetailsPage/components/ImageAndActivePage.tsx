import React, { useState } from "react";
import { Upload, Switch, message, Modal, Tooltip, Spin, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ImageService from "../../../services/image.service";

interface ImageAndActivePageProps {
  active: boolean;
  setActive: (value: boolean) => void;
  images: string[];
  setImages: (value: string[]) => void;
  menuId: string;
  menuItemId: string;
  handleSave: () => void;
}

const bucketName = "delivery";
const publicDomain = "https://pub-363dbd684ef24c85941b635a63222f54.r2.dev";
const imageService = new ImageService(bucketName, publicDomain);

const ImageAndActivePage: React.FC<ImageAndActivePageProps> = ({
  active,
  setActive,
  images,
  setImages,
  menuId,
  menuItemId,
  handleSave,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    Modal.confirm({
      title: "Confirm Upload",
      content: "Are you sure you want to upload this image?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        const rawFile = file.originFileObj || file;
        const key = `menu-items/${Date.now()}-${rawFile.name}`;
        const mimeType = rawFile.type;
        const publicURL = `${publicDomain}/${key}`;

        try {
          setUploading(true);
          await imageService.uploadImage(key, rawFile, mimeType);
          setImages((prev) => [...prev, publicURL]);
          await handleSave();
          message.success(`${rawFile.name} uploaded successfully!`);
          onSuccess && onSuccess("File uploaded successfully!");
        } catch (error) {
          console.error("Image upload error:", error);
          message.error("Failed to upload image. Please try again.");
          onError && onError(error);
        } finally {
          setUploading(false);
        }
      },
      onCancel: () => {
        message.info("Image upload canceled.");
      },
    });
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const handleModalClose = () => {
    setPreviewImage(null);
  };

  const handleDelete = (imageUrl: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this image?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          // Update state to remove the image
          setImages((prev) => prev.filter((img) => img !== imageUrl));
          
          // Call the save function to persist changes
          await handleSave();
          
          // Show success message
          message.success("Image deleted successfully!");
        } catch (error) {
          // Handle errors if save fails
          console.error("Error deleting image:", error);
          message.error("Failed to delete the image. Please try again.");
        }
      },
    });
  };
  

  const confirmToggleActive = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you really want to ${active ? "deactivate" : "activate"} this item?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await handleSave();
        setActive(!active);
      },
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Image and Active Status</h1>

      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-600 dark:text-gray-300">Active</label>
        <Switch checked={active} onChange={confirmToggleActive} />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-600 dark:text-gray-300">Images</label>
        <Upload
          listType="picture-card"
          customRequest={handleImageUpload}
          multiple
          showUploadList={false}
        >
          <Tooltip title="Click to upload images">
            <div className="flex flex-col items-center justify-center">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Tooltip>
        </Upload>
        {uploading && (
          <div className="mt-4 flex justify-center">
            <Spin tip="Uploading..." />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  {images.map((url, index) => (
    <motion.div
      key={index}
      className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md cursor-pointer glitter-effect"
      onMouseEnter={() => {
        console.log("Hovered:", url); // Debugging
        setHoveredImage(url);
      }}
      onMouseLeave={() => {
        console.log("Unhovered:", url); // Debugging
        setHoveredImage(null);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={url}
        alt="Menu Item"
        className="w-full h-full object-cover"
        onClick={() => handleImageClick(url)}
      />
      {hoveredImage === url && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Button
            className="bg-red-450 rounded-full border-2 border-white w-12 h-12 flex items-center justify-center transition-transform transform hover:scale-110"
            onClick={() => handleDelete(url)}
            icon={<DeleteOutlined />}
            size="large"
            aria-label="Delete Image"
          />
        </div>
      )}
    </motion.div>
  ))}
</div>


      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={handleModalClose}
        width="80%"
        centered
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={previewImage || ""}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
        </motion.div>
      </Modal>
    </div>
  );
};

export default ImageAndActivePage;
