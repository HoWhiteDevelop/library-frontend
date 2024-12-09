import { Col,Row, Spin } from "antd";
import { Book } from "../../types/book";
import BookCard from "./BookCard";
import { useEffect, useState } from "react";
import { getBooks } from "../../api/books";

const BookDetails: React.FC<{ T1: string; T2: string; T3: string }> = ({ T1, T2, T3 }) =>  {

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data); 
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

  const booksearch =books.filter(item => item.title.toLowerCase().includes(T1.toLowerCase())).
  filter(item => item.isbn.toLowerCase().includes(T2.toLowerCase())).
  filter(item => item.author.toLowerCase().includes(T3.toLowerCase()));


    return(
      <Row gutter={[16, 16]} className="p-4">
      {booksearch.map((book) => (
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
}

export default BookDetails;