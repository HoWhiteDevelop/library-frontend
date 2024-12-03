export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  publishDate: string;
  status: "available" | "borrowed";
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  publishDate: string;
}
