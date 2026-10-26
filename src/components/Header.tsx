import { NavLink } from 'react-router-dom';
import { useTheme } from '../features/theme/useTheme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

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
        <button type="button" className="header__toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
        </button>
      </div>
    </header>
  );
}
