import { create } from 'zustand';
import type { CategoryFilter } from '../../types/book';

interface FilterState {
  keyword: string;
  category: CategoryFilter;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  keyword: '',
  category: 'ALL',
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  reset: () => set({ keyword: '', category: 'ALL' }),
}));
