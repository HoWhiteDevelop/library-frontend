import { List, Avatar } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { LoanRecord } from "../types/book";

interface RecentBorrowListProps {
  books: LoanRecord[];
}

const RecentBorrowList = ({ books }: RecentBorrowListProps) => {
  const recentBorrows = [...books].sort((a, b) => {
    return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
  });

  return (
    <List
      itemLayout="horizontal"
      dataSource={recentBorrows}
      renderItem={(record) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar shape="square" size={48} icon={<BookOutlined />} />}
            title={record.bookTitle}
            description={`借阅者: ${record.userName} | 借阅时间: ${new Date(
              record.loanDate
            ).toLocaleDateString()}`}
          />
        </List.Item>
      )}
    />
  );
};

export default RecentBorrowList;
