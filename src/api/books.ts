import axios from "./axios";
import type { Book } from "../types/book";

interface BookQuery {
  q?: string;
  fields?: string;
  from?: number;
  size?: number;
}

// 获取图书列表
export const getBooks = () => {
  return axios.get<Book[]>("/books");
};

// 获取图书详情
export const getBookByIsbn = (isbn: string) => {
  return axios.get<Book>(`/books/${isbn}`);
};

// 搜索图书
export const searchBooks = (params: BookQuery) => {
  return axios.get<Book[]>("/books/search", { params });
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
