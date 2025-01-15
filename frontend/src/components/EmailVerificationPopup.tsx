import React, { useState, useEffect } from "react";
import { Button, Modal, message, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface EmailVerificationPopupProps {
  visible: boolean;
  onClose: () => void;
  onResend: () => Promise<void>;
  onCheck: () => Promise<boolean>;
  onSend: () => Promise<void>;
  title?: string;
  description?: string;
  successMessage?: string;
  timerDuration?: number; // Timer duration in seconds
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  visible,
  onClose,
  onResend,
  onCheck,
  onSend,
  title = "Verify Your Email",
  description = "Enter the 6-digit code sent to your email. If you don't see the email, click 'Resend Email.'",
  successMessage = "Your email has been successfully verified!",
  timerDuration = 30,
}) => {
  const [timer, setTimer] = useState(timerDuration);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isCodeCorrect, setIsCodeCorrect] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (visible) {
      resetTimer();
      setVerificationCode(["", "", "", "", "", ""]);
      setIsCodeCorrect(true);
      setIsVerified(false);
    }
  }, [visible]);

  const resetTimer = () => {
    setTimer(timerDuration);
    setIsResendDisabled(true);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isResendDisabled) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId!);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isResendDisabled]);

  const startLoading = () => setLoadingCount((prev) => prev + 1);
  const stopLoading = () => setLoadingCount((prev) => Math.max(prev - 1, 0));

  const handleResend = async () => {
    startLoading();
    try {
      await onResend();
      resetTimer();
      message.success("Verification email sent!");
    } catch (error) {
      message.error("Error sending verification email!");
    } finally {
      stopLoading();
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
  
    if (/[^0-9]/.test(value) && value !== "") return;
  
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
  
    setVerificationCode(newVerificationCode);
  
    if (value && index < 5) {
      // Move focus to the next input
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    } else if (!value && index > 0 && e.nativeEvent.inputType === "deleteContentBackward") {
      // Move focus to the previous input on backspace
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  
    if (newVerificationCode.join("").length === 6) {
      startLoading();
      const isValid = await onCheck();
      stopLoading();
  
      if (isValid) {
        handleSubmitVerification();
      } else {
        setIsCodeCorrect(false);
        setShake(true); // Trigger shake animation
        message.error("The verification code is incorrect. Please try again.");
        setTimeout(() => setShake(false), 500); // Reset shake state after animation
        setVerificationCode(["", "", "", "", "", ""]);
      }
    }
  };
  

  const handleSubmitVerification = async () => {
    startLoading();
    try {
      await onSend();
      message.success("Code verified successfully!");
      setIsVerified(true);
    } catch (error) {
      message.error("Error verifying code!");
    } finally {
      stopLoading();
    }
  };

  return (
    <Modal
      title=""
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
      style={{ backgroundColor: "#f9f9f9", padding: "20px" }}
    >
      <Spin spinning={loadingCount > 0} indicator={<LoadingOutlined spin />}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={shake ? "animate-shake" : ""}
        >
          {!isVerified ? (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{description}</p>

              <div className="flex justify-center mb-6 space-x-2">
                {verificationCode.map((digit, index) => (
                  <motion.input
                    key={index}
                    id={`input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    className="text-center text-lg p-3 w-12 mx-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    inputMode="numeric"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                ))}
              </div>

              {!isCodeCorrect && (
                <motion.p
                  className="text-red-500 font-semibold mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  The verification code is incorrect. Please try again.
                </motion.p>
              )}

              <Button
                type="primary"
                onClick={handleResend}
                disabled={isResendDisabled}
                className="w-full mt-4"
                style={{
                  backgroundColor: "#3b82f6",
                  borderColor: "#3b82f6",
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {isResendDisabled ? `Resend Email (${timer}s)` : "Resend Email"}
              </Button>
            </div>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircleOutlined
                style={{
                  fontSize: "48px",
                  color: "#3b82f6",
                  marginBottom: "20px",
                }}
              />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Verification Successful
              </h2>
              <p className="text-gray-600">{successMessage}</p>
            </motion.div>
          )}
        </motion.div>
      </Spin>
    </Modal>
  );
};

export default EmailVerificationPopup;
