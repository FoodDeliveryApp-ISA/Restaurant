import React from "react";
import { Steps } from "antd";
import { statusFlow } from "../../../utils/statusFlow";
import { getStepIcon } from "../../../utils/icons";
import { motion } from "framer-motion";

interface StepsWithIconsProps {
  currentStep: number;
}

const StepsWithIcons: React.FC<StepsWithIconsProps> = ({ currentStep }) => {
  const iconVariants = {
    waiting: {
      rotate: [0, 10, -10, 10, -10, 0], // Smooth oscillation
      scale: [1, 1.1, 1], // Slight pulsing effect
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
    },
    flip: {
      rotateY: 360, // Full flip
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    normal: { rotate: 0, scale: 1 },
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Steps current={currentStep} direction="vertical">
        {statusFlow.map((step, index) => (
          <Steps.Step
            key={step.title}
            title={step.title}
            icon={
              <motion.div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                animate={
                  index === currentStep
                    ? "waiting" // Smooth waiting animation for current step
                    : index < currentStep
                    ? "flip" // Full 360 flip animation for completed steps
                    : "normal" // Default state for upcoming steps
                }
                variants={iconVariants}
              >
                {getStepIcon(step.icon)}
              </motion.div>
            }
            description={step.description}
          />
        ))}
      </Steps>
    </div>
  );
};

export default StepsWithIcons;
