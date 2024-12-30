import type { FC } from "react";
import { LoadingOutlined, BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, List, Popover, Spin, Tabs, Tooltip } from "antd";
import { useEffect, useState } from "react";

// Sample Notice Interface
interface Notice {
  type: "notification" | "message" | "event";
  avatar: string;
  title: string;
  description: string;
  datetime: string;
  status?: string; // For event status
  extra?: string; // Extra information for events
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const HeaderNoticeComponent: FC = () => {
  const [visible, setVisible] = useState(false);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Notices Function
  const fetchNotices = async () => {
    setLoading(true);
    // Simulated API call
    const mockNotices: Notice[] = [
      {
        type: "notification",
        avatar: "https://via.placeholder.com/40",
        title: "New Message from John",
        description: "Hey, how are you doing?",
        datetime: "2024-12-29 10:30",
      },
      {
        type: "message",
        avatar: "https://via.placeholder.com/40",
        title: "System Update",
        description: "The system will be updated at midnight.",
        datetime: "2024-12-29 09:00",
      },
      {
        type: "event",
        avatar: "https://via.placeholder.com/40",
        title: "Meeting Reminder",
        description: "Don’t forget about the meeting at 3 PM.",
        datetime: "2024-12-29 08:00",
        status: "ongoing",
        extra: "Ongoing",
      },
    ];

    // Simulate delay
    setTimeout(() => {
      setLoading(false);
      setNoticeList(mockNotices);
    }, 1000);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Render Tab Content
  const renderTabContent = (type: Notice["type"]) => (
    <List
      dataSource={noticeList.filter((notice) => notice.type === type)}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href="#">{item.title}</a>}
            description={
              <div>
                <span>{item.description}</span>
                <div className="text-gray-500">{item.datetime}</div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const tabs = (
    <Spin tip="Loading..." indicator={antIcon} spinning={loading}>
      <Tabs defaultActiveKey="1" className="w-80">
        <Tabs.TabPane
          tab={`Notifications (${
            noticeList.filter((n) => n.type === "notification").length
          })`}
          key="1"
        >
          {renderTabContent("notification")}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`Messages (${
            noticeList.filter((n) => n.type === "message").length
          })`}
          key="2"
        >
          {renderTabContent("message")}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`Events (${
            noticeList.filter((n) => n.type === "event").length
          })`}
          key="3"
        >
          {renderTabContent("event")}
        </Tabs.TabPane>
      </Tabs>
    </Spin>
  );

  return (
    <Popover
      content={tabs}
      placement="bottomRight"
      trigger={["click"]}
      open={visible}
      onOpenChange={setVisible}
      overlayStyle={{ width: 336 }}
    >
      <Tooltip title="Notifications">
        <Badge
          count={noticeList.filter((n) => n.type === "notification").length}
          overflowCount={999}
        >
          <span className="cursor-pointer">
            <BellOutlined style={{ fontSize: "20px", color: "white" }} />
          </span>
        </Badge>
      </Tooltip>
    </Popover>
  );
};

export default HeaderNoticeComponent;
