import React, { useState } from "react";
import { Upload, Switch, message, Modal, Tooltip, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ImageService from "../../../services/image.service";

interface ImageAndActivePageProps {
  active: boolean;
  setActive: (value: boolean) => void;
  images: string[];
  setImages: (value: string[]) => void;
  menuId: string;
  menuItemId: string;
  handleSave: () => void; // Ensure this is defined and non-optional
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

  const handleImageUpload = async (file: File) => {
    const key = `menu-items/${Date.now()}-${file.name}`;
    const mimeType = file.type;
  
    try {
      setUploading(true)
      console.log(images);
      const publicUrl = await imageService.uploadImage(key, file, mimeType);
      console.log(publicUrl);
      console.log(images);
      setImages((prev) => [...prev, publicUrl]); // Append the new image URL to the state
      await handleSave(); // Ensure handleSave is saving image-related data
      message.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      message.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const handleModalClose = () => {
    setPreviewImage(null);
  };

  const updateMenuStatus = async (isActive: boolean) => {
    if (typeof handleSave === "function") {
      await handleSave();
      setActive(isActive);
    } else {
      console.error("handleSave is not a function");
      message.error("Error updating menu status. Please try again.");
    }
  };

  const confirmToggleActive = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you really want to ${active ? "deactivate" : "activate"} this item?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => updateMenuStatus(!active),
    });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Image and Active Status</h1>

      {/* Active Switch with Confirmation */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-600">Active</label>
        <Switch checked={active} onChange={confirmToggleActive} />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-600">Images</label>
        <Upload
          listType="picture-card"
          customRequest={({ file }) => handleImageUpload(file as File)}
          multiple
          showUploadList={false} // Do not display uploaded images in a list
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

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <motion.div
            key={index}
            className="w-24 h-24 rounded-lg overflow-hidden shadow-md cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleImageClick(url)}
          >
            <img
              src={url}
              alt="Menu Item"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Image Preview Modal */}
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
