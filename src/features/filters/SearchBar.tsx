import { useCallback, type ChangeEvent } from 'react';
import { useFilterStore } from './useFilterStore';

export default function SearchBar() {
  const keyword = useFilterStore((state) => state.keyword);
  const setKeyword = useFilterStore((state) => state.setKeyword);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value),
    [setKeyword],
  );

  const handleClear = useCallback(() => setKeyword(''), [setKeyword]);

  return (
    <div className="search">
      <svg className="search__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="search__input"
        placeholder="Tìm theo tên sách hoặc tác giả"
        aria-label="Tìm kiếm sách"
        value={keyword}
        onChange={handleChange}
      />
      {keyword.length > 0 && (
        <button
          type="button"
          className="search__clear"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
}

