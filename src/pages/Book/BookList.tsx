import  { Input, Card, Form, Select  } from "antd";
import { useState } from "react";
import PageTransition from "../../components/PageTransition";
import BookDetails from "../../components/books/BookDetails";

const {Search} = Input; 


const BookList = ()=>{
    const [searchTitle, setSearchTitle] = useState("");
    const [searchISBN, setSearchISBN] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    
    const [form] = Form.useForm();

    const options = [
      {value:'option1',label:'available'},
      {value:'option2',label:'borrowed'},
    ]
    const handleStatusChange = (value) => {
      setSearchStatus(value);
    };

    return(
        <PageTransition>
      <div className="page-container">
        <Card title="图书详情">
        


       <Form
        form={form}
        layout="inline"
        className="mb-2"
        >
        <Form.Item name="booktitle" label="图书名称">
        <Search
              style={{ width: 200 }}
              placeholder="搜索书名"
              allowClear
              enterButton
              className="max-w-md"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
        </Form.Item>
        <Form.Item name="bookisbn" label=" ISBN码">
        <Search
              style={{ width: 200 }}
              placeholder="搜索ISBN码"
              allowClear
              enterButton
              className="max-w-md"
              value={searchISBN}
              onChange={(e) => setSearchISBN(e.target.value)}
            />
        </Form.Item>
        <Form.Item name="bookauthor" label="作者姓名">
        <Search
              style={{ width: 200 }}
              placeholder="搜索姓名"
              allowClear
              enterButton
              className="max-w-md"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
        </Form.Item>
        <Form.Item name="status" label="借阅状态" initialValue="全部">
      <Select style={{ width: 150 }} onChange={handleStatusChange} defaultValue="全部">
        <Select.Option value="">全部</Select.Option>
        {options.map((option, index) => (
          <Select.Option key={index} value={option.label}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
        
        
          
      </Form>



        </Card>
        <BookDetails T1={searchTitle} T2={searchISBN} T3={searchAuthor} T4={searchStatus}/>
      </div>
    </PageTransition>
    );
};

export default BookList;