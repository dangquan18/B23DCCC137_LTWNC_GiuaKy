import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import BorrowedItem from './BorrowedItem';
import { selectBorrowedBooks, selectBorrowWarning } from './booksSelectors';
import { clearWarning, MAX_BORROWED, returnBook } from './booksSlice';

const SLOTS = Array.from({ length: MAX_BORROWED }, (_, index) => `slot-${index}`);

export default function BorrowedDock() {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const warning = useAppSelector(selectBorrowWarning);

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch],
  );

  const handleDismiss = useCallback(() => {
    dispatch(clearWarning());
  }, [dispatch]);

  return (
    <div className="dock-wrap">
      {warning && (
        <div className="toast" role="alert">
          <span className="toast__text">{warning}</span>
          <button type="button" className="toast__close" onClick={handleDismiss} aria-label="Đóng cảnh báo">
            ×
          </button>
        </div>
      )}

      <aside className="dock" aria-label="Sách đang mượn">
        <strong className="dock__label">Đang mượn</strong>
        <span className="dock__slots" aria-label={`${borrowedBooks.length}/${MAX_BORROWED} cuốn`}>
          {SLOTS.map((slot, index) => (
            <span key={slot} className={index < borrowedBooks.length ? 'dock__dot dock__dot--on' : 'dock__dot'} />
          ))}
        </span>

        {borrowedBooks.length === 0 ? (
          <span className="dock__empty">Bạn chưa mượn cuốn nào.</span>
        ) : (
          <ul className="dock__list">
            {borrowedBooks.map((book) => (
              <BorrowedItem key={book.id} book={book} onReturn={handleReturn} />
            ))}
          </ul>
        )}
      </aside>
    </div>

  );
}
