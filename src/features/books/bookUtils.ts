import type { Book, CategoryFilter, CategoryStats } from '../../types/book';

export function filterBooks(books: readonly Book[], keyword: string, category: CategoryFilter): Book[] {
  const normalized = keyword.trim().toLowerCase();
  return books.filter((book) => {
    const matchCategory = category === 'ALL' || book.category === category;
    const matchKeyword =
      normalized === '' ||
      book.title.toLowerCase().includes(normalized) ||
      book.author.toLowerCase().includes(normalized);
    return matchCategory && matchKeyword;
  });
}

export function countByCategory(books: readonly Book[]): CategoryStats {
  const stats: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
  for (const book of books) {
    stats[book.category] += 1;
  }
  return stats;
}

export function availableByCategory(books: readonly Book[]): CategoryStats {
  const totals: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
  for (const book of books) {
    totals[book.category] += book.available;
  }
  return totals;
}
