export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  price: number;
  description: string;
  cover: string;
  status: "available" | "borrowed" | "processing";
  location: {
    area: string;
    shelf: string;
    position: string;
  };
  borrowHistory?: {
    userId: string;
    userName: string;
    borrowDate: string;
    returnDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  price: number;
  description: string;
  cover?: string;
  location: {
    area: string;
    shelf: string;
    position: string;
  };
}
