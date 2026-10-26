export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface HasId {
  id: string;
}

export interface Book extends HasId {
  title: string;
  author: string;
  category: Category;
  year: number;
  available: number;
}

export type CategoryFilter = Category | 'ALL';

export type CategoryStats = Record<Category, number>;

export type BookSummary = Pick<Book, 'id' | 'title' | 'author'>;

export function isCategoryFilter(value: unknown): value is CategoryFilter {
  return typeof value === 'string' && (value === 'ALL' || CATEGORIES.some((category) => category === value));
}
