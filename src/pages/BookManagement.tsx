import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Space,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../store/slices/bookSlice";
import { addBook, updateBook, deleteBook } from "../api/books";
import type { Book, BookFormData } from "../types/book";
import type { AppDispatch, RootState } from "../store";

const { Search } = Input;
const { TextArea } = Input;

const BookManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading } = useSelector((state: RootState) => state.book);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Book) => {
    setEditingBook(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      message.success("删除成功");
      dispatch(fetchBooks());
    } catch {
      message.error("删除失败");
    }
  };

  const handleSubmit = async (values: BookFormData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, values);
        message.success("更新成功");
      } else {
        await addBook(values);
        message.success("添加成功");
      }
      setIsModalVisible(false);
      dispatch(fetchBooks());
    } catch {
      message.error(editingBook ? "更新失败" : "添加失败");
    }
  };

  const columns: ColumnsType<Book> = [
    {
      title: "书名",
      dataIndex: "title",
      key: "title",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (_, record) =>
        record.title.toLowerCase().includes(searchText.toLowerCase()),
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `¥${price.toFixed(2)}`,
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
    {
      title: "操作",
      key: "action",
      render: (_, record: Book) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这本书吗？"
            onConfirm={() => handleDelete(record.id.toString())}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card title="图书管理">
        <div className="mb-4 flex justify-between">
          <Search
            placeholder="搜索书名"
            allowClear
            className="max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" onClick={handleAdd}>
            添加图书
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={books}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingBook ? "编辑图书" : "添加图书"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingBook || undefined}
        >
          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{ required: true, message: "请输入ISBN" }]}
          >
            <Input placeholder="请输入ISBN" />
          </Form.Item>

          <Form.Item
            label="书名"
            name="title"
            rules={[{ required: true, message: "请输入书名" }]}
          >
            <Input placeholder="请输入书名" />
          </Form.Item>

          <Form.Item
            label="作者"
            name="author"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input placeholder="请输入作者" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              precision={2}
              placeholder="请输入价格"
            />
          </Form.Item>

          <Form.Item
            label="出版日期"
            name="publishDate"
            rules={[{ required: true, message: "请输入出版日期" }]}
          >
            <Input placeholder="请输入出版日期" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookManagement;
