import { memo, useCallback } from 'react';
import type { BookSummary } from '../../types/book';

interface BorrowedItemProps {
  book: BookSummary;
  onReturn: (id: string) => void;
}

function BorrowedItem({ book, onReturn }: BorrowedItemProps) {
  const handleReturn = useCallback(() => onReturn(book.id), [onReturn, book.id]);

  return (
    <li className="dock__item">
      <span className="dock__item-title" title={book.title}>
        {book.title}
      </span>
      <button type="button" className="dock__return" onClick={handleReturn}>
        Trả
      </button>
    </li>
  );
}

export default memo(BorrowedItem);
