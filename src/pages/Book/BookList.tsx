import  { Input, Card } from "antd";
import { useState } from "react";
import PageTransition from "../../components/PageTransition";
import BookDetails from "../../components/books/BookDetails";

const {Search} = Input; 


const BookList = ()=>{
    const [searchTitle, setSearchTitle] = useState("");
    const [searchISBN, setSearchISBN] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");

    



    return(
        <PageTransition>
      <div className="page-container">
        <Card title="图书详情">
          <div className="mb-4">
            <Search
              placeholder="搜索书名"
              allowClear
              enterButton
              className="max-w-md"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <Search
              placeholder="搜索ISBN码"
              allowClear
              enterButton
              className="max-w-md"
              value={searchISBN}
              onChange={(e) => setSearchISBN(e.target.value)}
            />
            <Search
              placeholder="搜索作者"
              allowClear
              enterButton
              className="max-w-md"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
          </div>
          <BookDetails T1={searchTitle} T2={searchISBN} T3={searchAuthor}/>
        </Card>
      </div>
    </PageTransition>
    );
};

export default BookList;