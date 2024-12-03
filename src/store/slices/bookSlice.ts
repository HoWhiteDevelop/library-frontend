import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { getBooks, recommendBook } from "../../api/books";
import type { Book } from "../../types/book";

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk("book/fetchBooks", async () => {
  const response = await getBooks();
  return response.data;
});

export const createBookRecommendation = createAsyncThunk(
  "book/recommend",
  async (bookData: Partial<Book>) => {
    const response = await recommendBook(bookData);
    return response.data;
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "获取图书列表失败";
        message.error(state.error);
      })
      .addCase(createBookRecommendation.fulfilled, (_state, _action) => {
        message.success("图书推荐成功");
      });
  },
});

export default bookSlice.reducer;
