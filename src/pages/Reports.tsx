import { useState } from "react";
import { Tabs } from "antd";
import BookStatusReport from "./reports/BookStatusReport";
import BorrowReport from "./reports/BorrowReport";

const Reports = () => {
  const [activeKey, setActiveKey] = useState("status");

  return (
    <div className="page-container">
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: "status",
            label: "图书状态报表",
            children: <BookStatusReport />,
          },
          {
            key: "borrow",
            label: "借阅报表",
            children: <BorrowReport />,
          },
        ]}
      />
    </div>
  );
};

export default Reports;
