import { useEffect, useState } from "react";
import { Table, Card, Input, Button, Tag, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/slices/bookSlice";
import { borrowBook } from "../../api/books";
import type { Book } from "../../types/book";
import type { AppDispatch, RootState } from "../../store";
import PageTransition from "../../components/PageTransition";

const { Search } = Input;

const BookBorrow = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleBorrow = async (bookId: number) => {
    try {
      await borrowBook(bookId.toString());
      message.success("借阅成功");
      dispatch(fetchBooks());
    } catch {
      message.error("借阅失败");
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
        <Button
          type="primary"
          disabled={record.status !== "available"}
          onClick={() => handleBorrow(record.id)}
        >
          借阅
        </Button>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <Card title="图书借阅">
          <div className="mb-4">
            <Search
              placeholder="搜索书名"
              allowClear
              enterButton
              className="max-w-md"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
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
      </div>
    </PageTransition>
  );
};

export default BookBorrow;
