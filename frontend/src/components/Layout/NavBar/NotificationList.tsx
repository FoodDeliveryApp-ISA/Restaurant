import { FC, useState } from "react";
import { Spin, Empty, Pagination } from "antd";
import { motion } from "framer-motion";

interface Notice {
  id: number;
  type: string;
  title: string;
  description: string;
  datetime: string;
  isRead: boolean;
}

interface NotificationListProps {
  loading: boolean;
  noticeList: Notice[];
  markAsRead: (id: number) => void;
  clearAllNotifications: () => void;
}

const NotificationList: FC<NotificationListProps> = ({
  loading,
  noticeList,
  markAsRead,
  clearAllNotifications,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const extractOrderId = (description: string): string | null => {
    const orderIdStartIndex = 10;
    const spaceIndex = description.indexOf(" ", orderIdStartIndex);
    return spaceIndex !== -1
      ? description.slice(orderIdStartIndex, spaceIndex)
      : description.slice(orderIdStartIndex);
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = noticeList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Spin tip="Loading..." spinning={loading}>
      {noticeList.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="space-y-4"
          >
            {paginatedList.map((item) => {
              const orderId = extractOrderId(item.description);

              return (
                <motion.div
                  key={item.id}
                  variants={listItemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-md bg-white shadow-sm transition"
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className={`text-lg font-semibold ${
                        item.isRead ? "text-gray-800" : "text-blue-600"
                      }`}
                    >
                      {orderId ? `Order(#${orderId})` : item.title}
                    </h3>
                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-sm text-blue-500 hover:text-blue-700 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                  <div className="flex justify-between mt-3 text-sm text-gray-700">
                    <span>{item.datetime.split(",")[1]?.trim()}</span>
                    <span>{item.datetime.split(",")[0]}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="flex justify-between items-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={noticeList.length}
              onChange={(page) => setCurrentPage(page)}
              className="text-sm"
            />
            <button
              onClick={clearAllNotifications}
              className="text-sm text-blue-500 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      ) : (
        <Empty
          description="No Notifications"
          className="bg-white p-4 rounded-lg shadow-md"
        />
      )}
    </Spin>
  );
};

export default NotificationList;
