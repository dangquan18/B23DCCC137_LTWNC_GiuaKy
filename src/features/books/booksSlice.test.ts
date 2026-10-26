import { makeBook } from '../../test-utils/factories';
import booksReducer, {
  borrowBook,
  borrowLimitExceeded,
  clearWarning,
  fetchBooks,
  initialState,
  returnBook,
  type BooksState,
} from './booksSlice';

const sampleBooks = [
  makeBook({ id: 'b1', available: 2 }),
  makeBook({ id: 'b2', title: 'Nhà đầu tư thông minh', category: 'Kinh tế', available: 0 }),
];

const loadedState = (override: Partial<BooksState> = {}): BooksState => ({
  ...initialState,
  status: 'succeeded',
  items: sampleBooks.map((book) => ({ ...book })),
  ...override,
});

const availableOf = (state: BooksState, id: string) => state.items.find((book) => book.id === id)?.available;

describe('booksSlice reducer', () => {
  it('trả về initial state khi nhận action không xác định', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetchBooks.pending chuyển status sang loading và xoá lỗi cũ', () => {
    const prev: BooksState = { ...initialState, status: 'failed', error: 'Lỗi cũ' };
    const state = booksReducer(prev, fetchBooks.pending('req', undefined));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchBooks.fulfilled lưu danh sách sách và chuyển status sang succeeded', () => {
    const state = booksReducer({ ...initialState, status: 'loading' }, fetchBooks.fulfilled(sampleBooks, 'req', undefined));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(sampleBooks);
  });

  it('fetchBooks.rejected lưu thông báo lỗi và chuyển status sang failed', () => {
    const action = fetchBooks.rejected(null, 'req', undefined, 'API lỗi');
    const state = booksReducer({ ...initialState, status: 'loading' }, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('API lỗi');
  });

  it('borrowBook giảm số bản còn lại 1 và thêm id vào danh sách đang mượn', () => {
    const state = booksReducer(loadedState(), borrowBook('b1'));
    expect(availableOf(state, 'b1')).toBe(1);
    expect(state.borrowedIds).toEqual(['b1']);
  });

  it('borrowBook không thay đổi state khi sách đã hết bản', () => {
    const state = booksReducer(loadedState(), borrowBook('b2'));
    expect(availableOf(state, 'b2')).toBe(0);
    expect(state.borrowedIds).toEqual([]);
  });

  it('borrowBook bỏ qua id không tồn tại', () => {
    const before = loadedState();
    expect(booksReducer(before, borrowBook('khong-ton-tai'))).toEqual(before);
  });

  it('returnBook tăng số bản còn lại 1 và bỏ id khỏi danh sách đang mượn', () => {
    const borrowed = booksReducer(loadedState(), borrowBook('b1'));
    const state = booksReducer(borrowed, returnBook('b1'));
    expect(availableOf(state, 'b1')).toBe(2);
    expect(state.borrowedIds).toEqual([]);
  });

  it('returnBook bỏ qua sách không nằm trong danh sách đang mượn', () => {
    const state = booksReducer(loadedState(), returnBook('b1'));
    expect(availableOf(state, 'b1')).toBe(2);
  });

  it('borrowLimitExceeded đặt cảnh báo, clearWarning xoá cảnh báo', () => {
    const warned = booksReducer(loadedState(), borrowLimitExceeded('Quá giới hạn'));
    expect(warned.warning).toBe('Quá giới hạn');
    expect(booksReducer(warned, clearWarning()).warning).toBeNull();
  });
});
