import { Button, Col,Form,Row, Spin } from "antd";
import { Book } from "../../types/book";
import { useEffect, useState } from "react";
import { getBooks } from "../../api/books";
import BookShower from "./BookShower";


const BookDetails: React.FC<{ T1: string; T2: string; T3: string ; T4:string}> = ({ T1, T2, T3,T4 }) =>  {

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
  filter(item => item.author.toLowerCase().includes(T3.toLowerCase())).
  filter(item => item.status.toLowerCase().includes(T4.toLowerCase()));

  const totalItems = booksearch.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = booksearch.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Row gutter={[16, 16]} className="p-4">
        {currentBooks.map((book) => (
          <Col 
            key={book.id} xs={24} sm={12} md={8} lg={6} xl={4.8} className="mb-4"
          >
            <BookShower book={book} />   
          </Col>
        ))}
      </Row>
      <div >
          <Button style={{ backgroundColor: 'white', color: 'black' ,right:'calc(50%-100px)'}}
           onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>前一页</Button>
          <span className="mx-2">第{currentPage}页 / 共{totalPages}页</span>
          <Button style={{ backgroundColor: 'white', color: 'black' ,right:'calc(50%-100px)' }}
            onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>后一页</Button>
      </div>
    
    </div>
  );
};

export default BookDetails;