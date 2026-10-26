import { setupStore } from '../../app/store';
import { makeBook } from '../../test-utils/factories';
import { borrowBook, initialState, returnBook } from './booksSlice';
import { BORROW_LIMIT_MESSAGE } from './borrowLimitMiddleware';

const createLoadedStore = () =>
  setupStore({
    books: {
      ...initialState,
      status: 'succeeded',
      items: ['b1', 'b2', 'b3', 'b4', 'b5'].map((id) => makeBook({ id, available: 2 })),
    },
  });

describe('borrowLimitMiddleware', () => {
  it('cho phép mượn khi chưa đủ 3 cuốn', () => {
    const store = createLoadedStore();

    ['b1', 'b2', 'b3'].forEach((id) => store.dispatch(borrowBook(id)));

    expect(store.getState().books.borrowedIds).toEqual(['b1', 'b2', 'b3']);
    expect(store.getState().books.warning).toBeNull();
  });

  it('chặn cuốn thứ 4, giữ nguyên số bản và hiện cảnh báo', () => {
    const store = createLoadedStore();

    ['b1', 'b2', 'b3', 'b4'].forEach((id) => store.dispatch(borrowBook(id)));

    const { books } = store.getState();
    expect(books.borrowedIds).toHaveLength(3);
    expect(books.borrowedIds).not.toContain('b4');
    expect(books.items.find((book) => book.id === 'b4')?.available).toBe(2);
    expect(books.warning).toBe(BORROW_LIMIT_MESSAGE);
  });

  it('cho mượn tiếp sau khi trả bớt sách', () => {
    const store = createLoadedStore();
    ['b1', 'b2', 'b3'].forEach((id) => store.dispatch(borrowBook(id)));

    store.dispatch(returnBook('b1'));
    store.dispatch(borrowBook('b4'));

    expect(store.getState().books.borrowedIds).toEqual(['b2', 'b3', 'b4']);
  });
});
