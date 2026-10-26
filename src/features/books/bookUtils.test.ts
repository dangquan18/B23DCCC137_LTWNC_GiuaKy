import { makeBook } from '../../test-utils/factories';
import { availableByCategory, countByCategory, filterBooks } from './bookUtils';

const books = [
  makeBook({ id: '1', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT' }),
  makeBook({ id: '2', title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế' }),
  makeBook({ id: '3', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ' }),
  makeBook({ id: '4', title: 'Refactoring', author: 'Martin Fowler', category: 'CNTT' }),
];

const ids = (list: { id: string }[]) => list.map((book) => book.id);

describe('bookUtils', () => {
  it('filterBooks tìm theo tên hoặc tác giả, không phân biệt hoa thường', () => {
    expect(ids(filterBooks(books, 'CLEAN', 'ALL'))).toEqual(['1']);
    expect(ids(filterBooks(books, 'kahneman', 'ALL'))).toEqual(['2']);
    expect(ids(filterBooks(books, 'martin', 'ALL'))).toEqual(['1', '4']);
  });

  it('filterBooks kết hợp lọc theo thể loại', () => {
    expect(ids(filterBooks(books, '', 'Ngoại ngữ'))).toEqual(['3']);
    expect(filterBooks(books, 'clean', 'Kinh tế')).toEqual([]);
  });

  it('countByCategory đếm số đầu sách theo thể loại', () => {
    expect(countByCategory(books)).toEqual({ CNTT: 2, 'Kinh tế': 1, 'Ngoại ngữ': 1 });
  });
});

describe('availableByCategory', () => {
  it('cộng số bản còn lại theo thể loại', () => {
    const list = [
      makeBook({ id: '1', category: 'CNTT', available: 2 }),
      makeBook({ id: '2', category: 'CNTT', available: 3 }),
      makeBook({ id: '3', category: 'Kinh tế', available: 1 }),
    ];
    expect(availableByCategory(list)).toEqual({ CNTT: 5, 'Kinh tế': 1, 'Ngoại ngữ': 0 });
  });
});
