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
  App,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { Book } from "../../types/book";
import type { RootState } from "../../store";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

interface BookStatusFilter {
  status?: string;
  dateRange?: [string, string];
}

const BookStatusReport = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
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
    try {
      const exportData = filteredBooks.map((book) => ({
        书名: book.title,
        ISBN: book.isbn,
        作者: book.author,
        出版日期: new Date(book.publishDate).toLocaleDateString(),
        状态: book.status === "available" ? "可借" : "已借出",
        价格: book.price,
        描述: book.description,
      }));

      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 20 }, // 书名
        { wch: 15 }, // ISBN
        { wch: 15 }, // 作者
        { wch: 12 }, // 出版日期
        { wch: 8 }, // 状态
        { wch: 8 }, // 价格
        { wch: 30 }, // 描述
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "图书状态报表");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      saveAs(blob, `图书状态报表_${timestamp}.xlsx`);

      message.success("导出成功");
    } catch (error) {
      console.error("导出Excel失败:", error);
      message.error("导出失败");
    }
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
            <Button
              onClick={handleExport}
              icon={<DownloadOutlined />}
              loading={loading}
            >
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
