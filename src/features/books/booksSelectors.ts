import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/rootReducer';
import type { BookSummary } from '../../types/book';
import { findById } from '../../utils/collection';

export const selectBooks = (state: RootState) => state.books.items;
export const selectBorrowedIds = (state: RootState) => state.books.borrowedIds;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBorrowWarning = (state: RootState) => state.books.warning;

export const selectBorrowedBooks = createSelector(
  [selectBooks, selectBorrowedIds],
  (books, borrowedIds): BookSummary[] =>
    borrowedIds.flatMap((id) => {
      const book = findById(books, id);
      return book ? [{ id: book.id, title: book.title, author: book.author }] : [];
    }),
);
