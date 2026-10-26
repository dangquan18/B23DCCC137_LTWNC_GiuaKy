import { memo, useCallback } from 'react';
import type { Book } from '../../types/book';

export interface BookItemProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

function BookItem({ book, isBorrowed, onBorrow, onReturn }: BookItemProps) {
  const outOfStock = book.available <= 0;

  const handleBorrow = useCallback(() => onBorrow(book.id), [onBorrow, book.id]);
  const handleReturn = useCallback(() => onReturn(book.id), [onReturn, book.id]);

  return (
    <li className={isBorrowed ? 'book-card book-card--borrowed' : 'book-card'} data-category={book.category}>
      <div className="book-card__body">
        <span className="book-card__tag">
          {book.category} · {book.year}
        </span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
      </div>

      <div className="book-card__footer">
        <span className={outOfStock ? 'book-card__stock book-card__stock--empty' : 'book-card__stock'}>
          {outOfStock ? 'Hết bản' : `Còn ${book.available} bản`}
        </span>
        {isBorrowed ? (
          <button type="button" className="pill-btn pill-btn--outline" onClick={handleReturn}>
            Trả
          </button>
        ) : (
          <button type="button" className="pill-btn" onClick={handleBorrow} disabled={outOfStock}>
            Mượn
          </button>
        )}
      </div>
    </li>
  );
}

export default memo(BookItem);
