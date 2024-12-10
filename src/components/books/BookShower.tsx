import { Card, Image } from "antd";
import { Book } from "../../types/book";
import defaultBookCover from "../../assets/images/default-book-cover.jpg";

interface BookCardProps {
  book: Book;
}

const BookShower = ({ book }: BookCardProps) => {
  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-xl"
      cover={
        <div className="p-4 bg-gray-50">
          <Image
            alt={book.title}
            src={book.coverUrl || defaultBookCover}
            className="object-contain h-48 w-full"
            fallback={defaultBookCover}
          />
        </div>
      }
    >
      <Card.Meta
        title={book.title}
        description={
          <div className="space-y-1">
            <div className="text-gray-500">作者：{book.author}</div>
            <div className="text-gray-500">ISBN：{book.isbn}</div>
            <div className="text-gray-500">出版日期：{book.publishDate}</div>
            <div className="text-blue-500">状态：{book.status === "available" ? "可借" : "已借出"}</div>
            <div className="text-yellow-500">简述：{book.description}</div>
            <div className="text-red-500">价格：{book.price}</div>
          </div>
        }
      />
    </Card>
  );
};

export default BookShower;
