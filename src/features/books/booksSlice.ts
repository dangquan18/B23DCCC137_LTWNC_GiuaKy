import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getBooks, type GetBooksOptions } from '../../api/booksApi';
import { isApiSuccess } from '../../types/api';
import type { Book } from '../../types/book';
import { findById } from '../../utils/collection';

export const MAX_BORROWED = 3;

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BooksState {
  items: Book[];
  borrowedIds: string[];
  status: LoadingStatus;
  error: string | null;
  warning: string | null;
}

export const initialState: BooksState = {
  items: [],
  borrowedIds: [],
  status: 'idle',
  error: null,
  warning: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  Partial<GetBooksOptions> | undefined,
  { state: { books: BooksState }; rejectValue: string }
>(
  'books/fetchBooks',
  async (options, { rejectWithValue }) => {
    const response = await getBooks(options);
    return isApiSuccess(response) ? response.data : rejectWithValue(response.error);
  },
  {
    condition: (_options, { getState }) => {
      const { status } = getState().books;
      return status !== 'loading' && status !== 'succeeded';
    },
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = findById(state.items, action.payload);
      if (!book || book.available <= 0 || state.borrowedIds.includes(book.id)) return;
      book.available -= 1;
      state.borrowedIds.push(book.id);
      state.warning = null;
    },
    returnBook(state, action: PayloadAction<string>) {
      if (!state.borrowedIds.includes(action.payload)) return;
      const book = findById(state.items, action.payload);
      if (book) book.available += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== action.payload);
      state.warning = null;
    },
    borrowLimitExceeded(state, action: PayloadAction<string>) {
      state.warning = action.payload;
    },
    clearWarning(state) {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định';
      });
  },
});

export const { borrowBook, returnBook, borrowLimitExceeded, clearWarning } = booksSlice.actions;
export default booksSlice.reducer;
