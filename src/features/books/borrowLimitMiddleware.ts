import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../../app/rootReducer';
import { borrowBook, borrowLimitExceeded, MAX_BORROWED } from './booksSlice';

export const BORROW_LIMIT_MESSAGE = `Bạn chỉ được mượn tối đa ${MAX_BORROWED} cuốn cùng lúc. Hãy trả bớt sách trước khi mượn thêm.`;

export const borrowLimitMiddleware: Middleware<object, RootState> = (store) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const { borrowedIds } = store.getState().books;
    const isNewBorrow = !borrowedIds.includes(action.payload);
    if (isNewBorrow && borrowedIds.length >= MAX_BORROWED) {
      return store.dispatch(borrowLimitExceeded(BORROW_LIMIT_MESSAGE));
    }
  }
  return next(action);
};
