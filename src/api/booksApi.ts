import type { ApiResponse } from '../types/api';
import type { Book } from '../types/book';

export interface GetBooksOptions {
  shouldFail: boolean;
  delay: number;
}

export const DEFAULT_DELAY = 500;

const MOCK_BOOKS: ReadonlyArray<Readonly<Book>> = [
  { id: 'b01', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3, cover: '/covers/b01.jpg' },
  { id: 'b02', title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', category: 'CNTT', year: 1999, available: 2, cover: '/covers/b02.jpg' },
  { id: 'b03', title: 'Design Patterns', author: 'Erich Gamma và cộng sự', category: 'CNTT', year: 1994, available: 1, cover: '/covers/b03.jpg' },
  { id: 'b04', title: 'Refactoring', author: 'Martin Fowler', category: 'CNTT', year: 2018, available: 0, cover: '/covers/b04.jpg' },
  { id: 'b05', title: "You Don't Know JS Yet", author: 'Kyle Simpson', category: 'CNTT', year: 2020, available: 4, cover: '/covers/b05.jpg' },
  { id: 'b06', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'CNTT', year: 2009, available: 2, cover: '/covers/b06.jpg' },
  { id: 'b07', title: 'Nguyên lý kinh tế học', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2020, available: 5, cover: '/covers/b07.jpg' },
  { id: 'b08', title: 'Nhà đầu tư thông minh', author: 'Benjamin Graham', category: 'Kinh tế', year: 1949, available: 1, cover: '/covers/b08.jpg' },
  { id: 'b09', title: 'Cha giàu cha nghèo', author: 'Robert T. Kiyosaki', category: 'Kinh tế', year: 1997, available: 0, cover: '/covers/b09.jpg' },
  { id: 'b10', title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế', year: 2011, available: 2, cover: '/covers/b10.jpg' },
  { id: 'b11', title: 'Kinh tế học hài hước', author: 'Steven D. Levitt', category: 'Kinh tế', year: 2005, available: 3, cover: '/covers/b11.jpg' },
  { id: 'b12', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', year: 2019, available: 6, cover: '/covers/b12.jpg' },
  { id: 'b13', title: 'Oxford Word Skills', author: 'Ruth Gairns, Stuart Redman', category: 'Ngoại ngữ', year: 2008, available: 2, cover: '/covers/b13.jpg' },
  { id: 'b14', title: 'Minna no Nihongo', author: '3A Corporation', category: 'Ngoại ngữ', year: 2012, available: 0, cover: '/covers/b14.jpg' },
  { id: 'b15', title: 'Cambridge IELTS 18', author: 'Cambridge University Press', category: 'Ngoại ngữ', year: 2023, available: 1, cover: '/covers/b15.jpg' },
  { id: 'b16', title: 'Giáo trình Hán ngữ', author: 'Dương Ký Châu', category: 'Ngoại ngữ', year: 2002, available: 3, cover: '/covers/b16.jpg' },
];

export function getBooks(options: Partial<GetBooksOptions> = {}): Promise<ApiResponse<Book[]>> {
  const { shouldFail = false, delay = DEFAULT_DELAY } = options;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Không thể tải danh sách sách. Vui lòng thử lại sau.' });
        return;
      }
      resolve({ ok: true, data: MOCK_BOOKS.map((book) => ({ ...book })) });
    }, delay);
  });
}
