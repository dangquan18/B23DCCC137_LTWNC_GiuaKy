import { memo, useCallback, useRef } from 'react';
import type { Book, Category } from '../../types/book';
import BookItem from './BookItem';

interface CategorySectionProps {
  category: Category;
  books: Book[];
  borrowedIds: ReadonlySet<string>;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

function CategorySection({ category, books, borrowedIds, onBorrow, onReturn }: CategorySectionProps) {
  const rowRef = useRef<HTMLUListElement>(null);
  const totalAvailable = books.reduce((sum, book) => sum + book.available, 0);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  const handlePrev = useCallback(() => scrollBy(-1), [scrollBy]);
  const handleNext = useCallback(() => scrollBy(1), [scrollBy]);

  return (
    <section className="category-section" data-category={category}>
      <div className="category-section__head">
        <div>
          <h2 className="category-section__title">{category}</h2>
          <p className="category-section__meta">
            {books.length} đầu sách · còn {totalAvailable} bản
          </p>
        </div>
        <div className="category-section__arrows">
          <button type="button" className="round-btn" onClick={handlePrev} aria-label={`Cuộn trái hàng ${category}`}>
            ‹
          </button>
          <button type="button" className="round-btn" onClick={handleNext} aria-label={`Cuộn phải hàng ${category}`}>
            ›
          </button>
        </div>
      </div>

      <ul className="book-row" ref={rowRef}>
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            isBorrowed={borrowedIds.has(book.id)}
            onBorrow={onBorrow}
            onReturn={onReturn}
          />
        ))}
      </ul>
    </section>
  );
}

export default memo(CategorySection);
