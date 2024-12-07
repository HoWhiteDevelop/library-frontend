import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { getBooks, recommendBook, getLoanHistory } from "../../api/books";
import type { Book, LoanRecord, ApiResponse } from "../../types/book";

interface BookState {
  books: Book[];
  loanHistory: LoanRecord[];
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  loanHistory: [],
  loading: false,
  historyLoading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  void,
  { rejectValue: string }
>("book/fetchBooks", async () => {
  const response = await getBooks();
  return response.data;
});

export const createBookRecommendation = createAsyncThunk<
  ApiResponse<Book>,
  Partial<Book>,
  { rejectValue: string }
>("book/recommend", async (bookData) => {
  const response = await recommendBook(bookData);
  return response.data;
});

export const fetchLoanHistory = createAsyncThunk<
  LoanRecord[],
  void,
  { rejectValue: string }
>("book/fetchLoanHistory", async () => {
  const response = await getLoanHistory();
  return response.data.data;
});

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
      .addCase(createBookRecommendation.fulfilled, (state, action) => {
        message.success("图书推荐成功");
      })
      .addCase(fetchLoanHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanHistory.fulfilled, (state, action) => {
        state.loanHistory = action.payload;
        state.historyLoading = false;
      })
      .addCase(fetchLoanHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.error.message || "获取借阅历史失败";
        message.error(state.error);
      });
  },
});

export default bookSlice.reducer;
