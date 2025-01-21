import { FC, useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Popover, Tooltip, Spin, Drawer, Button , message} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import NotificationService from "../../../services/notification.service";
import NotificationList from "./NotificationList";
import CustomPopup from "./CustomPopup";
import TokenUtil from "../../../utils/tokenUtil";
import orderService from "../../../services/order.service";

interface Notice {
  id: number;
  type: string;
  title: string;
  description: string;
  datetime: string;
  isRead: boolean;
}

const HeaderNoticeComponent: FC = () => {
  const [visible, setVisible] = useState(false);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const isMobile = window.innerWidth <= 768;



  const handleAcceptOrder = async (orderId: string) => {
    try {
      console.log("Calling orderService.acceptOrder with:", orderId);
      const response = await orderService.acceptOrder(orderId); // Replace with your actual service
      console.log("Response from acceptOrder:", response);
      message.success("Order has been accepted.");
      // setNotificationVisible(false); // Hide notification
    } catch (error) {
      console.error("Error in handleAcceptOrder:", error);
      message.error("Failed to accept the order. Please try again.");
    }
  };

  // Handle Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    try {
      console.log("Calling orderService.cancelOrder with:", orderId);
      const response = await orderService.cancelOrder(orderId); // Replace with your actual service
      console.log("Response from cancelOrder:", response);
      message.error("The order has been cancelled.");
      // setNotificationVisible(false); // Hide notification
    } catch (error) {
      console.error("Error in handleCancelOrder:", error);
      message.error("Failed to cancel the order. Please try again.");
    }
  };

  const useFetch = (fetchFunction: () => Promise<Notice[]>, dependencies: any[]) => {
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchFunction();
          setNoticeList(data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, dependencies);
  };

  useFetch(
    async () => {
      const notices = await NotificationService.getAllNotifications();
      return notices
        .map((n) => ({
          id: n.id,
          type: n.type || "notification",
          title: n.title || "Notification",
          description: n.message,
          datetime: new Date(n.createdAt).toLocaleString(),
          isRead: n.isRead,
        }))
        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    },
    [visible]
  );

  const handleNewNotification = (message: string) => {
    const newNotification: Notice = {
      id: Date.now(),
      type: "notification",
      title: "New Notification",
      description: message,
      datetime: new Date().toLocaleString(),
      isRead: false,
    };
    setNoticeList((prev) => [newNotification, ...prev]);
    setPopupMessage(message); // Show popup
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      setNoticeList((prev) =>
        prev.map((notice) =>
          notice.id === notificationId ? { ...notice, isRead: true } : notice
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await NotificationService.clearAllNotifications();
      setNoticeList([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNoticeList((prev) => prev.map((notice) => ({ ...notice, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    const restaurantId = TokenUtil.getRestaurantId();

    if (restaurantId) {
      NotificationService.connectStompWebSocket(String(restaurantId), handleNewNotification);
    } else {
      console.error("Restaurant ID not found in token");
    }

    return () => {
      NotificationService.disconnectWebSocket();
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <Drawer
          visible={visible}
          onClose={() => setVisible(false)}
          title={
            <div className="flex justify-between items-center">
              <span>Notifications</span>
              <Button type="link" onClick={markAllAsRead} disabled={noticeList.every((n) => n.isRead)}>
                Mark All as Read
              </Button>
            </div>
          }
          placement="right"
          closable
        >
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <Spin size="large" />
            </div>
          ) : (
            <NotificationList
              loading={loading}
              noticeList={noticeList}
              markAsRead={markAsRead}
              clearAllNotifications={clearAllNotifications}
            />
          )}
        </Drawer>
      ) : (
        <Popover
          content={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span>Notifications</span>
                <Button type="link" onClick={markAllAsRead} disabled={noticeList.every((n) => n.isRead)}>
                  Mark All as Read
                </Button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center p-6">
                  <Spin size="large" />
                </div>
              ) : (
                <NotificationList
                  loading={loading}
                  noticeList={noticeList}
                  markAsRead={markAsRead}
                  clearAllNotifications={clearAllNotifications}
                />
              )}
            </motion.div>
          }
          placement="bottomRight"
          trigger={["click"]}
          open={visible}
          onOpenChange={setVisible}
          overlayStyle={{ width: 336 }}
        >
          <Tooltip title="Notifications">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
            >
              <Badge
                count={noticeList.filter((n) => !n.isRead).length}
                overflowCount={999}
              >
                <BellOutlined style={{ fontSize: "24px", color: "#fff" }} />
              </Badge>
            </motion.div>
          </Tooltip>
        </Popover>
      )}
      <AnimatePresence>
  {popupMessage && (
    <CustomPopup
      message={popupMessage}
      onClose={() => setPopupMessage(null)}
      onAccept={(orderId) => handleAcceptOrder(orderId)}
          onReject={(orderId) => handleCancelOrder(orderId)}
      index={noticeList.length} // Pass the index based on the notice list length
    />
  )}
</AnimatePresence>

    </>
  );
};

export default HeaderNoticeComponent;
