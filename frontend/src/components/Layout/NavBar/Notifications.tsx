import { FC, useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Popover, Tooltip, Spin, Drawer } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import NotificationService from "../../../services/notification.service";
import NotificationList from "./NotificationList";
import CustomPopup from "./CustomPopup";

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
      await NotificationService.markAllAsRead();
      setNoticeList((prev) => prev.map((notice) => ({ ...notice, isRead: true })));
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  useEffect(() => {
    NotificationService.connectStompWebSocket("353", handleNewNotification);

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
          title="Notifications"
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderNoticeComponent;
