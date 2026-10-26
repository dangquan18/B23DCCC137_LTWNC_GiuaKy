import { useCallback, type MouseEvent } from 'react';
import { CATEGORIES, isCategoryFilter, type CategoryFilter } from '../../types/book';
import { useFilterStore } from './useFilterStore';

const OPTIONS: ReadonlyArray<{ value: CategoryFilter; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  ...CATEGORIES.map((category) => ({ value: category, label: category })),
];

export default function CategoryFilterBar() {
  const category = useFilterStore((state) => state.category);
  const setCategory = useFilterStore((state) => state.setCategory);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { value } = event.currentTarget.dataset;
      if (isCategoryFilter(value)) setCategory(value);
    },
    [setCategory],
  );

  return (
    <div className="pills" role="group" aria-label="Lọc theo thể loại">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          data-value={option.value}
          className={category === option.value ? 'pill pill--active' : 'pill'}
          aria-pressed={category === option.value}
          onClick={handleClick}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
