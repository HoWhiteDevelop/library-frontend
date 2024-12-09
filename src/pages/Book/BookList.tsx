import  { Input, Card } from "antd";
import { SetStateAction, useState } from "react";
import PageTransition from "../../components/PageTransition";
import BookDetails from "../../components/books/BookDetails";

const {Search} = Input; 


const BookList = ()=>{
    const [searchTitle, setSearchTitle] = useState("");
    const [searchISBN, setSearchISBN] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");

    
    const [selectedOption, setSelectedOption] = useState("");

   
    const handleChange = (event) => {
      const state = event.target.value=="可借" ? "available" : "borrowed";
      setSelectedOption(state);
    };
  
   
      
    


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
          </div>
          <div className="mb-4">
            <Search
              placeholder="搜索ISBN码"
              allowClear
              enterButton
              className="max-w-md"
              value={searchISBN}
              onChange={(e) => setSearchISBN(e.target.value)}
            />
           </div>
           <div className="mb-4">
            <Search
              placeholder="搜索作者"
              allowClear
              enterButton
              className="max-w-md"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
          </div>

          <div className="mb-4">
          <h3>借阅状态:</h3>
           {/* 下拉菜单 */}
           <select value={selectedOption} onChange={handleChange}>
          <option value="">--是否可借阅--</option>
          <option value="option1">已借出</option>
          <option value="option2">可借</option>
          {selectedOption}
           </select>
           </div>

          <BookDetails T1={searchTitle} T2={searchISBN} T3={searchAuthor} T4={selectedOption}/>
        </Card>
      </div>
    </PageTransition>
    );
};

export default BookList;