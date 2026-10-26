import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CATEGORIES } from '../../types/book';
import CategoryFilterBar from '../filters/CategoryFilterBar';
import SearchBar from '../filters/SearchBar';
import BookList from './BookList';
import { selectBooks, selectBooksError, selectBooksStatus, selectBorrowedIds } from './booksSelectors';
import { borrowBook, fetchBooks, MAX_BORROWED, returnBook } from './booksSlice';
import { useFilteredBooks } from './useFilteredBooks';

export default function BooksPage() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const borrowedIds = useAppSelector(selectBorrowedIds);

  const { filteredBooks } = useFilteredBooks();
  const borrowedSet = useMemo(() => new Set(borrowedIds), [borrowedIds]);

  const handleBorrow = useCallback(
    (id: string) => {
      dispatch(borrowBook(id));
    },
    [dispatch],
  );

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch],
  );

  const handleRetry = useCallback(() => {
    void dispatch(fetchBooks());
  }, [dispatch]);

  const subtitle =
    status === 'succeeded'
      ? `${books.length} đầu sách. ${CATEGORIES.length} thể loại. Mượn tối đa ${MAX_BORROWED} cuốn cùng lúc.`
      : `Mượn tối đa ${MAX_BORROWED} cuốn cùng lúc.`;

  return (
    <div className="books-page">
      <div className="hero">
        <h1 className="hero__title">Tra cứu &amp; mượn sách.</h1>
        <p className="hero__subtitle">{subtitle}</p>
        <SearchBar />
        <CategoryFilterBar />
      </div>

      {(status === 'idle' || status === 'loading') && <p className="status">Đang tải...</p>}

      {status === 'failed' && (
        <div className="alert alert--error" role="alert">
          <span>{error}</span>
          <button type="button" className="pill-btn pill-btn--outline" onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <BookList books={filteredBooks} borrowedIds={borrowedSet} onBorrow={handleBorrow} onReturn={handleReturn} />
      )}
    </div>
  );
}
