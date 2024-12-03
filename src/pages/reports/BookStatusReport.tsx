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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { Book } from "../../types/book";
import type { RootState } from "../../store";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface BookStatusFilter {
  area?: string;
  status?: string;
  dateRange?: [string, string];
}

const BookStatusReport = () => {
  const [form] = Form.useForm();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const handleFilter = (values: BookStatusFilter) => {
    let filtered = [...books];
    if (values.area) {
      filtered = filtered.filter((book) => book.location.area === values.area);
    }
    if (values.status) {
      filtered = filtered.filter((book) => book.status === values.status);
    }
    if (values.dateRange) {
      const [start, end] = values.dateRange;
      filtered = filtered.filter(
        (book) => book.createdAt >= start && book.createdAt <= end
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
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "位置",
      dataIndex: "location",
      key: "location",
      render: (location: Book["location"]) =>
        `${location.area}-${location.shelf}-${location.position}`,
    },
    {
      title: "入库时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
        <Form.Item name="area" label="馆藏区">
          <Select style={{ width: 120 }} allowClear>
            <Option value="A">A区</Option>
            <Option value="B">B区</Option>
            <Option value="C">C区</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select style={{ width: 120 }} allowClear>
            <Option value="available">可借</Option>
            <Option value="borrowed">已借出</Option>
            <Option value="processing">处理中</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="入库时间">
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
