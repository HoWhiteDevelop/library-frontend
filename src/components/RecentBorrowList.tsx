import { List, Avatar } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { Book } from "../types/book";

interface RecentBorrowListProps {
  books: Book[];
}

const RecentBorrowList = ({ books }: RecentBorrowListProps) => {
  const recentBorrows = books
    .filter((book) => book.status === "borrowed")
    .sort((a, b) => {
      const aDate =
        a.borrowHistory?.[a.borrowHistory.length - 1].borrowDate || "";
      const bDate =
        b.borrowHistory?.[b.borrowHistory.length - 1].borrowDate || "";
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, 5);

  return (
    <List
      itemLayout="horizontal"
      dataSource={recentBorrows}
      renderItem={(book) => {
        const lastBorrow = book.borrowHistory?.[book.borrowHistory.length - 1];
        return (
          <List.Item>
            <List.Item.Meta
              avatar={
                book.cover ? (
                  <Avatar shape="square" size={48} src={book.cover} />
                ) : (
                  <Avatar shape="square" size={48} icon={<BookOutlined />} />
                )
              }
              title={book.title}
              description={`借阅者: ${lastBorrow?.userName} | 借阅时间: ${
                lastBorrow?.borrowDate
                  ? new Date(lastBorrow.borrowDate).toLocaleDateString()
                  : "未知"
              }`}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default RecentBorrowList;
