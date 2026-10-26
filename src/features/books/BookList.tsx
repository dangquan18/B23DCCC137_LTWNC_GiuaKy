import { memo, useMemo } from 'react';
import { CATEGORIES, type Book } from '../../types/book';
import CategorySection from './CategorySection';

interface BookListProps {
  books: Book[];
  borrowedIds: ReadonlySet<string>;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

function BookList({ books, borrowedIds, onBorrow, onReturn }: BookListProps) {
  const groups = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        books: books.filter((book) => book.category === category),
      })).filter((group) => group.books.length > 0),
    [books],
  );

  if (groups.length === 0) {
    return (
      <div className="empty-state">
        <p className="status">Không tìm thấy sách phù hợp.</p>
        <p className="empty-state__hint">Hãy thử đổi từ khóa tìm kiếm hoặc chọn lại thể loại khác.</p>
      </div>
    );
  }


  return (
    <div className="book-sections">
      {groups.map((group) => (
        <CategorySection
          key={group.category}
          category={group.category}
          books={group.books}
          borrowedIds={borrowedIds}
          onBorrow={onBorrow}
          onReturn={onReturn}
        />
      ))}
    </div>
  );
}

export default memo(BookList);

