import { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import { getBooks } from "../../api/books";
import BookCard from "./BookCard";
import type { Book } from "../../types/book";

const BookGrid = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data); // 只显示前10本书
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]} className="p-4">
      {books.map((book) => (
        <Col
          key={book.id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={4.8}
          className="mb-4"
        >
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
};

export default BookGrid;
