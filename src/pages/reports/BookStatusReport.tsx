import { useState } from "react";
import {
  Card,
  Table,
  Form,
  Select,
  Button,
  Space,
  DatePicker,
  message,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { Book } from "../../types/book";
import type { RootState } from "../../store";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface BookStatusFilter {
  status?: string;
  dateRange?: [string, string];
}

const BookStatusReport = () => {
  const [form] = Form.useForm();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const handleFilter = (values: BookStatusFilter) => {
    let filtered = [...books];
    if (values.status) {
      filtered = filtered.filter((book) => book.status === values.status);
    }
    if (values.dateRange) {
      const [start, end] = values.dateRange;
      filtered = filtered.filter(
        (book) => book.publishDate >= start && book.publishDate <= end
      );
    }
    setFilteredBooks(filtered);
  };

  const handleExport = () => {
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
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "出版日期",
      dataIndex: "publishDate",
      key: "publishDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "可借" : "已借出"}
        </Tag>
      ),
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
        <Form.Item name="status" label="状态">
          <Select style={{ width: 120 }} allowClear>
            <Option value="available">可借</Option>
            <Option value="borrowed">已借出</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="出版日期">
          <DatePicker.RangePicker />
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

export default BookStatusReport;
