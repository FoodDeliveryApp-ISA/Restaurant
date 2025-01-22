import React, { useState } from "react";
import { Upload, Tooltip, Spin, message, Modal, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ImageService from "../../../services/image.service";
import ImageSlider from "./ImageSlider"; // Import the ImageSlider component

interface ImageUploaderProps {
  images: string[];
  setImages: (value: string[]) => void;
  handleSave: (updatedImages: string[]) => void;
}

const bucketName = "delivery";
const publicDomain = "https://pub-363dbd684ef24c85941b635a63222f54.r2.dev";
const imageService = new ImageService(bucketName, publicDomain);

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, handleSave }) => {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      const rawFile = file.originFileObj || file;
      const key = `menu-items/${Date.now()}-${rawFile.name}`;
  
      // Upload the image
      await imageService.uploadImage(key, rawFile, rawFile.type);
  
      // Add the new image to the state
      const newImageUrl = `${publicDomain}/${key}`;
      const updatedImages = [...images, newImageUrl];
      setImages(updatedImages);
  
      // Pass the updated images and active state to handleSave
      handleSave(updatedImages, active);
  
      message.success(`${rawFile.name} uploaded successfully!`);
      onSuccess("File uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload image. Please try again.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageDelete = (imageUrl: string) => {
    Modal.confirm({
      title: "Delete Image?",
      content: "This action cannot be undone. Are you sure?",
      onOk: async () => {
        try {
          // Remove the image from the state
          const updatedImages = images.filter((img) => img !== imageUrl);
          setImages(updatedImages);
  
          // Pass the updated images and active state to handleSave
          await handleSave(updatedImages, active);
  
          message.success("Image deleted!");
        } catch (error) {
          message.error("Failed to delete image. Please try again.");
          console.error("Error deleting image:", error);
        }
      },
    });
  };
  
  

  const openPreview = (index: number) => {
    setCurrentSlide(index);
    setPreviewVisible(true);
  };

  return (
    <div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            className="relative overflow-hidden rounded-md shadow"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={image}
              alt={`Image ${idx + 1}`}
              className="object-cover w-full h-full cursor-pointer"
              onClick={() => openPreview(idx)}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleImageDelete(image)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full"
            />
          </motion.div>
        ))}
        <Upload
          listType="picture-card"
          customRequest={handleImageUpload}
          showUploadList={false}
        >
          <Tooltip title="Upload">
            <div className="flex items-center justify-center">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Tooltip>
        </Upload>
      </div>
      {uploading && <Spin tip="Uploading..." />}
      {previewVisible && (
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          centered
          width={800}
        >
          <ImageSlider
            images={images}
            initialSlide={currentSlide}
            onClose={() => setPreviewVisible(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ImageUploader;
