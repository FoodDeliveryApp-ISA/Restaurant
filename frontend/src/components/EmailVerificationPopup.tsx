import React, { useState, useEffect } from "react";
import { Button, Modal, message, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

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
  title = "Verify Your Email", // Default title
  description = "Enter the 6-digit code sent to your email. If you don't see the email, click 'Resend Email.'", // Default description
  successMessage = "Your email has been successfully verified!", // Default success message
  timerDuration = 30, // Default timer duration
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

  // Reset timer and flags when the popup is opened
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

  // Start the countdown when `isResendDisabled` is true
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
      resetTimer(); // Reset timer when resend is clicked
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
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }

    if (newVerificationCode.join("").length === 6) {
      startLoading();
      const isValid = await onCheck();
      stopLoading();

      if (isValid) {
        handleSubmitVerification();
      } else {
        setIsCodeCorrect(false);
        message.error("The verification code is incorrect. Please try again.");
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
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <Spin spinning={loadingCount > 0} indicator={<LoadingOutlined spin />}>
        {!isVerified ? (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            <div className="flex justify-center mb-6 space-x-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  className="text-center text-lg p-3 w-12 mx-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="numeric"
                />
              ))}
            </div>

            {!isCodeCorrect && (
              <p className="text-red-500 font-semibold mt-2">
                The verification code is incorrect. Please try again.
              </p>
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
          <div className="text-center">
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
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default EmailVerificationPopup;
