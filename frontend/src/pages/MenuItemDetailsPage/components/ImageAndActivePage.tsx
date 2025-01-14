import React from "react";
import ImageUploader from "./ImageUploader";
import ActiveButton from "./ActiveButton";

interface ImageAndActivePageProps {
  active: boolean;
  setActive: (value: boolean) => void;
  images: string[];
  setImages: (value: string[]) => void;
  handleSave: () => void;
}

const ImageAndActivePage: React.FC<ImageAndActivePageProps> = ({
  active,
  setActive,
  images,
  setImages,
  handleSave,
}) => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Images & Status
      </h2>
      <div className="mb-4">
        <ActiveButton
          active={active}
          setActive={(newActive) => {
            setActive(newActive);
            handleSave(images, newActive); // Pass updated images and active state
          }}
          handleSave={handleSave}
        />
      </div>
      <ImageUploader
        images={images}
        setImages={(updatedImages) => {
          setImages(updatedImages);
          handleSave(updatedImages, active); // Pass updated images and active state
        }}
        handleSave={handleSave}
      />
    </div>
  );
};

export default ImageAndActivePage;
