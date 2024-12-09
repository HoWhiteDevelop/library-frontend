export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  publishDate: string;
  status: "available" | "borrowed" | "借阅中";
  coverUrl?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  publishDate: string;
}

export interface LoanRecord {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  bookTitle: string;
  loanDate: string;
  returnDate: string | null;
  dueDate: string;
  status: "borrowed" | "returned" | "overdue";
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
