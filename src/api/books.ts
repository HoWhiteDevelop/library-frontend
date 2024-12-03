import axios from "./axios";
import { Book } from "../types/book";

interface BookQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
}

interface BookResponse {
  data: Book[];
  total: number;
}

// 获取图书列表
export const getBooks = (params?: BookQuery) => {
  return axios.get<BookResponse>("/books", { params });
};

// 获取图书详情
export const getBookById = (id: string) => {
  return axios.get<Book>(`/books/${id}`);
};

// 推荐图书
export const recommendBook = (bookData: Partial<Book>) => {
  return axios.post("/books/recommend", bookData);
};

// 借阅图书
export const borrowBook = (bookId: string) => {
  return axios.post(`/books/${bookId}/borrow`);
};

// 归还图书
export const returnBook = (bookId: string) => {
  return axios.post(`/books/${bookId}/return`);
};

// 上架图书
export const addBook = (bookData: Partial<Book>) => {
  return axios.post("/books", bookData);
};

// 更新图书信息
export const updateBook = (id: string, bookData: Partial<Book>) => {
  return axios.put(`/books/${id}`, bookData);
};

// 删除图书
export const deleteBook = (id: string) => {
  return axios.delete(`/books/${id}`);
};

// 通过ISBN获取图书信息
export const getBookByIsbn = (isbn: string) => {
  return axios.get<Book>(`/books/isbn/${isbn}`);
};
