import type { Book } from '../types/book';

export function makeBook(override: Partial<Book> = {}): Book {
  return {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'CNTT',
    year: 2008,
    available: 2,
    ...override,
  };
}
