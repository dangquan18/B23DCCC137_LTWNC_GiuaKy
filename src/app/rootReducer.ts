import { combineReducers } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';

export const rootReducer = combineReducers({
  books: booksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
