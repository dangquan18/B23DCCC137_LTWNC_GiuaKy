import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { CATEGORIES } from '../../types/book';
import { selectBooks, selectBooksStatus, selectBorrowedIds } from '../books/booksSelectors';
import { MAX_BORROWED } from '../books/booksSlice';
import { availableByCategory, countByCategory } from '../books/bookUtils';

export default function StatsPage() {
  const books = useAppSelector(selectBooks);
  const status = useAppSelector(selectBooksStatus);
  const borrowedCount = useAppSelector(selectBorrowedIds).length;

  const counts = useMemo(() => countByCategory(books), [books]);
  const available = useMemo(() => availableByCategory(books), [books]);
  const totalAvailable = useMemo(() => books.reduce((sum, book) => sum + book.available, 0), [books]);
  const maxCount = Math.max(1, ...CATEGORIES.map((category) => counts[category]));

  if (status === 'idle' || status === 'loading') {
    return <p className="status">Đang tải...</p>;
  }

  return (
    <section className="stats">
      <div className="hero">
        <h1 className="hero__title">Thống kê thư viện.</h1>
        <p className="hero__subtitle">Cập nhật theo từng lượt mượn và trả.</p>
      </div>

      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-tile__value">{books.length}</span>
          <span className="stat-tile__label">Tổng đầu sách</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{totalAvailable}</span>
          <span className="stat-tile__label">Tổng số bản còn lại</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">
            <span className="stat-tile__accent">{borrowedCount}</span>
            <span className="stat-tile__max">/{MAX_BORROWED}</span>
          </span>
          <span className="stat-tile__label">Sách đang mượn</span>
        </div>
      </div>

      <div className="stats-card">
        <h2 className="stats-card__title">Số đầu sách theo thể loại</h2>
        <ul className="stats-list">
          {CATEGORIES.map((category) => (
            <li key={category} className="stats-row" data-category={category}>
              <div className="stats-row__head">
                <span className="stats-row__name">{category}</span>
                <span className="stats-row__meta">
                  {counts[category]} đầu sách · {available[category]} bản còn lại
                </span>
              </div>
              <progress
                className="stats-row__bar"
                value={counts[category]}
                max={maxCount}
                aria-label={`${category}: ${counts[category]} đầu sách`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
