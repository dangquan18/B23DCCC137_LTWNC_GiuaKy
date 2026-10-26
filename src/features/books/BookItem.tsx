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
      <div className="book-card__cover" aria-hidden="true">
        {book.cover && (
          <img
            src={book.cover}
            alt=""
            className="book-card__cover-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="book-card__cover-overlay" />
        <span className="book-card__cover-year">{book.year}</span>
        {isBorrowed && <span className="book-card__badge book-card__badge--borrowed">Đang mượn</span>}
        {!isBorrowed && outOfStock && <span className="book-card__badge book-card__badge--out">Hết sách</span>}
        {!isBorrowed && !outOfStock && book.available === 1 && (
          <span className="book-card__badge book-card__badge--low">Chỉ còn 1</span>
        )}
      </div>


      <div className="book-card__body">
        <span className="book-card__tag">
          {book.category} · {book.year}
        </span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
      </div>

      <div className="book-card__footer">
        <div className="book-card__stock-wrap">
          <span
            className={`book-card__stock-dot ${
              outOfStock ? 'is-empty' : book.available === 1 ? 'is-low' : 'is-good'
            }`}
            aria-hidden="true"
          />
          <span className={outOfStock ? 'book-card__stock book-card__stock--empty' : 'book-card__stock'}>
            {outOfStock ? 'Hết bản' : `Còn ${book.available} bản`}
          </span>
        </div>
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
