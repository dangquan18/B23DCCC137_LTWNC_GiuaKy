import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectBorrowedIds } from '../features/books/booksSelectors';
import { useTheme } from '../features/theme/useTheme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const borrowedCount = useAppSelector(selectBorrowedIds).length;

  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__brand">Mini Library</span>
        <nav className="header__nav" aria-label="Điều hướng chính">
          <NavLink to="/" end className="nav-link">
            Sách
          </NavLink>
          <NavLink to="/stats" className="nav-link">
            Thống kê
          </NavLink>
        </nav>
        <div className="header__actions">
          {borrowedCount > 0 && (
            <span className="header__badge" title={`Đang mượn ${borrowedCount} cuốn`}>
              <span className="header__badge-dot" />
              <span>{borrowedCount}/3</span>
            </span>
          )}
          <button type="button" className="header__toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </div>

      </div>
    </header>
  );
}

