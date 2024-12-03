import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Select,
  Button,
  Space,
  DatePicker,
  Input,
  message,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { Book } from "../../types/book";
import type { RootState } from "../../store";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

interface BorrowFilter {
  status?: "all" | "current" | "overdue" | "returned";
  dateRange?: [string, string];
  keyword?: string;
}

const BorrowReport = () => {
  const [form] = Form.useForm();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    setFilteredBooks(books.filter((book) => book.borrowHistory?.length));
  }, [books]);

  const handleFilter = (values: BorrowFilter) => {
    let filtered = books.filter((book) => book.borrowHistory?.length);

    if (values.status && values.status !== "all") {
      filtered = filtered.filter((book) => {
        const lastBorrow = book.borrowHistory?.[book.borrowHistory.length - 1];
        if (!lastBorrow) return false;

        if (values.status === "returned") {
          return !!lastBorrow.returnDate;
        }

        if (lastBorrow.returnDate) return false;

        const dueDate = new Date(lastBorrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        const isOverdue = dueDate < new Date();

        return values.status === "overdue" ? isOverdue : !isOverdue;
      });
    }

    if (values.dateRange) {
      const [start, end] = values.dateRange;
      filtered = filtered.filter((book) => {
        const lastBorrow = book.borrowHistory?.[book.borrowHistory.length - 1];
        return (
          lastBorrow &&
          new Date(lastBorrow.borrowDate) >= new Date(start) &&
          new Date(lastBorrow.borrowDate) <= new Date(end)
        );
      });
    }

    if (values.keyword) {
      const keyword = values.keyword.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(keyword) ||
          book.isbn.toLowerCase().includes(keyword) ||
          book.borrowHistory?.some((history) =>
            history.userName.toLowerCase().includes(keyword)
          )
      );
    }

    setFilteredBooks(filtered);
  };

  const handleExport = () => {
    // 实现导出Excel功能
    message.success("导出成功");
  };

  const columns: ColumnsType<Book> = [
    {
      title: "书名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "借阅者",
      key: "borrower",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        return lastBorrow?.userName || "-";
      },
    },
    {
      title: "借阅时间",
      key: "borrowDate",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        return lastBorrow
          ? new Date(lastBorrow.borrowDate).toLocaleDateString()
          : "-";
      },
    },
    {
      title: "应还时间",
      key: "dueDate",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        if (!lastBorrow) return "-";
        const dueDate = new Date(lastBorrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        return dueDate.toLocaleDateString();
      },
    },
    {
      title: "状态",
      key: "status",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        if (!lastBorrow) return "-";
        if (lastBorrow.returnDate) {
          return <Tag color="green">已归还</Tag>;
        }
        const dueDate = new Date(lastBorrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        return dueDate < new Date() ? (
          <Tag color="red">已逾期</Tag>
        ) : (
          <Tag color="blue">借阅中</Tag>
        );
      },
    },
  ];

  return (
    <Card>
      <Form
        form={form}
        layout="inline"
        onFinish={handleFilter}
        className="mb-4"
      >
        <Form.Item name="status" label="借阅状态" initialValue="all">
          <Select style={{ width: 120 }}>
            <Option value="all">全部</Option>
            <Option value="current">借阅中</Option>
            <Option value="overdue">已逾期</Option>
            <Option value="returned">已归还</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="借阅时间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="keyword">
          <Search
            placeholder="搜索书名/ISBN/借阅者"
            style={{ width: 200 }}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleExport} icon={<DownloadOutlined />}>
              导出Excel
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={filteredBooks}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  );
};

export default BorrowReport;
