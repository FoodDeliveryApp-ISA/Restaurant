import React, { useState } from "react";
import { Modal } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";

interface ImageSliderProps {
  images: string[];
  initialSlide: number;
  onClose: () => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, initialSlide, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      visible={true}
      footer={null}
      onCancel={onClose}
      centered
      width={800}
      closable={false}
      bodyStyle={{ padding: 0, overflow: "hidden", borderRadius: "8px" }}
    >
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white text-gray-700 rounded-full shadow-md p-2 hover:bg-gray-200 transition-transform transform hover:scale-110"
        >
          <CloseOutlined className="text-lg" />
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-10 bg-white text-gray-700 rounded-full shadow-md p-3 hover:bg-gray-200 transition-transform transform hover:scale-110"
        >
          <LeftOutlined className="text-xl" />
        </button>

        {/* Image Slider */}
        <div className="w-full h-full overflow-hidden relative">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {images.map((image, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={image}
                  alt={`Image ${idx + 1}`}
                  className="max-w-full max-h-[500px] object-contain rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 bg-white text-gray-700 rounded-full shadow-md p-3 hover:bg-gray-200 transition-transform transform hover:scale-110"
        >
          <RightOutlined className="text-xl" />
        </button>
      </div>
    </Modal>
  );
};

export default ImageSlider;
