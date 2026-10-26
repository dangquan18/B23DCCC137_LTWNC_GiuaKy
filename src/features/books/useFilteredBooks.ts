import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import type { Book, CategoryFilter } from '../../types/book';
import { useFilterStore } from '../filters/useFilterStore';
import { selectBooks } from './booksSelectors';
import { filterBooks } from './bookUtils';

export const SEARCH_DEBOUNCE_MS = 300;

export interface UseFilteredBooksResult {
  filteredBooks: Book[];
  keyword: string;
  category: CategoryFilter;
}

export function useFilteredBooks(): UseFilteredBooksResult {
  const books = useAppSelector(selectBooks);
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_MS);

  const filteredBooks = useMemo(
    () => filterBooks(books, debouncedKeyword, category),
    [books, debouncedKeyword, category],
  );

  return { filteredBooks, keyword: debouncedKeyword, category };
}
