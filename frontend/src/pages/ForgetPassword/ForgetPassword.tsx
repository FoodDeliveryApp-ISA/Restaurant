import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Button, Input, Typography, Alert, Card, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ToastNotification from "../../components/ToastNotification";
import PasswordService from "../../services/password.service";

const { Title, Text } = Typography;

const ForgetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true);
        await PasswordService.validateResetToken(token!);
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        navigate("/401");
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      ToastNotification.error({
        message: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    try {
      setLoading(true);
      await PasswordService.resetPassword({ token: token!, newPassword: password });
      ToastNotification.success({
        message: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      navigate("/login");
    } catch (error) {
      ToastNotification.error({
        message: "Password Reset Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spin size="large" tip="Validating token..." />
      </div>
    );
  }

  if (isValidToken === false) return null;

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <Card className="max-w-lg w-full shadow-2xl rounded-2xl p-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Title level={3} className="text-center mb-4 text-indigo-700">
              Reset Your Password
            </Title>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Text type="secondary" className="block text-center mb-6 text-gray-500">
              Enter your new password below to securely reset it.
            </Text>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Tooltip
                title="Use at least 8 characters, including letters, numbers, and symbols."
                placement="topRight"
              >
                <Input.Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  required
                  className="rounded-full"
                  suffix={<InfoCircleOutlined className="text-gray-400" />}
                />
              </Tooltip>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <Input.Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="rounded-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="rounded-full h-12"
              >
                Reset Password
              </Button>
            </motion.div>
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6"
          >
            <Alert
              message="Tips for Strong Passwords"
              description="Create a password that’s easy to remember but hard to guess. Use a mix of uppercase, lowercase, numbers, and symbols."
              type="info"
              showIcon
              className="rounded-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {/* <Text type="secondary" className="block text-center mt-6">
              Need help? <a href="/help">Contact Support</a>
            </Text> */}
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ForgetPassword;
