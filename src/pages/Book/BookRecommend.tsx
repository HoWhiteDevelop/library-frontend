import { useState } from "react";
import { Form, Input, Button, Card, InputNumber, message } from "antd";
import { useDispatch } from "react-redux";
import { createBookRecommendation } from "../../store/slices/bookSlice";
import { getBookByIsbn } from "../../api/books";
import type { AppDispatch } from "../../store";
import type { BookFormData } from "../../types/book";

const { TextArea } = Input;

const BookRecommend = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);

  const onFinish = async (values: BookFormData) => {
    try {
      setLoading(true);
      await dispatch(createBookRecommendation(values)).unwrap();
      form.resetFields();
    } catch (error) {
      console.error("推荐图书失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIsbnSearch = async () => {
    const isbn = form.getFieldValue("isbn");
    if (!isbn) {
      message.warning("请输入ISBN");
      return;
    }

    try {
      setIsbnLoading(true);
      const response = await getBookByIsbn(isbn);
      const bookData = response.data;
      form.setFieldsValue({
        title: bookData.title,
        author: bookData.author,
        publisher: bookData.publisher,
        publishDate: bookData.publishDate,
        price: bookData.price,
        description: bookData.description,
      });
    } catch {
      message.error("获取图书信息失败");
    } finally {
      setIsbnLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card title="图书荐购" className="max-w-2xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{ required: true, message: "请输入ISBN" }]}
          >
            <Input.Search
              placeholder="请输入ISBN"
              loading={isbnLoading}
              onSearch={handleIsbnSearch}
            />
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
            label="出版社"
            name="publisher"
            rules={[{ required: true, message: "请输入出版社" }]}
          >
            <Input placeholder="请输入出版社" />
          </Form.Item>

          <Form.Item
            label="出版日期"
            name="publishDate"
            rules={[{ required: true, message: "请输入出版日期" }]}
          >
            <Input placeholder="请输入出版日期" />
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

          <Form.Item label="简介" name="description">
            <TextArea rows={4} placeholder="请输入图书简介" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              提交荐购
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BookRecommend;
