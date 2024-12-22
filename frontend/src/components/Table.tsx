import React, { useState } from "react";
import { Table, Card, Row, Col } from "antd";

interface TablesProps {
  columns: any[];
  data: any[];
  title: string;
}

const Tables: React.FC<TablesProps> = ({
  columns,
  data: initialData,
  title,
}) => {
  const [data, setData] = useState(initialData);

  const handleStatusToggle = (key: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, status: !item.status } : item
      )
    );
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs={24} xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={title}
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowClassName={(record) =>
                  record.status ? "bg-green-50" : "bg-red-50"
                }
                className="ant-border-space modern-table"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Tables;
