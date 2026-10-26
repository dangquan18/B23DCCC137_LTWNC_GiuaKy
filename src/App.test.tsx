import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getBooks } from './api/booksApi';
import { BORROW_LIMIT_MESSAGE } from './features/books/borrowLimitMiddleware';
import { useFilterStore } from './features/filters/useFilterStore';
import { makeBook } from './test-utils/factories';
import { renderWithProviders } from './test-utils/renderWithProviders';

jest.mock('./api/booksApi');
const mockedGetBooks = getBooks as jest.MockedFunction<typeof getBooks>;

const books = [
  makeBook({ id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', available: 2 }),
  makeBook({ id: 'b2', title: 'Refactoring', author: 'Martin Fowler', category: 'CNTT', available: 1 }),
  makeBook({ id: 'b3', title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế', available: 1 }),
  makeBook({ id: 'b4', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', available: 3 }),
];

const getCard = (title: string) => {
  const card = screen.getByRole('heading', { name: title }).closest('li');
  if (!card) throw new Error(`Không tìm thấy thẻ sách "${title}"`);
  return within(card);
};

describe('App (integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    useFilterStore.getState().reset();
  });

  afterEach(() => jest.clearAllMocks());

  it('hiển thị "Đang tải..." rồi danh sách sách khi API thành công', async () => {
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });

    renderWithProviders(<App />);

    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.queryByText('Đang tải...')).toBeNull();
    expect(mockedGetBooks).toHaveBeenCalledTimes(1);
  });

  it('hiển thị thông báo lỗi khi API thất bại', async () => {
    mockedGetBooks.mockResolvedValue({ ok: false, error: 'Lỗi máy chủ' });

    renderWithProviders(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Lỗi máy chủ');
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument();
  });

  it('lọc theo thể loại', async () => {
    const user = userEvent.setup();
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Clean Code' });

    await user.click(screen.getByRole('button', { name: 'Kinh tế' }));

    expect(screen.getByRole('heading', { name: 'Tư duy nhanh và chậm' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Clean Code' })).toBeNull();
  });

  it('tìm kiếm theo tác giả không phân biệt hoa thường (sau debounce)', async () => {
    const user = userEvent.setup();
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Clean Code' });

    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm sách' }), 'FOWLER');

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Clean Code' })).toBeNull());
    expect(screen.getByRole('heading', { name: 'Refactoring' })).toBeInTheDocument();
  });

  it('mượn / trả sách cập nhật số bản và chặn khi mượn quá 3 cuốn', async () => {
    const user = userEvent.setup();
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Clean Code' });

    await user.click(getCard('Clean Code').getByRole('button', { name: 'Mượn' }));
    expect(getCard('Clean Code').getByText('Còn 1 bản')).toBeInTheDocument();

    await user.click(getCard('Refactoring').getByRole('button', { name: 'Mượn' }));
    await user.click(getCard('Tư duy nhanh và chậm').getByRole('button', { name: 'Mượn' }));
    await user.click(getCard('English Grammar in Use').getByRole('button', { name: 'Mượn' }));

    expect(screen.getByRole('alert')).toHaveTextContent(BORROW_LIMIT_MESSAGE);
    expect(getCard('English Grammar in Use').getByText('Còn 3 bản')).toBeInTheDocument();

    await user.click(getCard('Clean Code').getByRole('button', { name: 'Trả' }));
    expect(getCard('Clean Code').getByText('Còn 2 bản')).toBeInTheDocument();
  });

  it('chuyển giao diện sáng / tối', async () => {
    const user = userEvent.setup();
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: /Giao diện tối/ }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: /Giao diện sáng/ })).toBeInTheDocument();
  });

  it('trang /stats được lazy load và hiển thị thống kê', async () => {
    mockedGetBooks.mockResolvedValue({ ok: true, data: books });

    renderWithProviders(<App />, { route: '/stats' });

    expect(await screen.findByRole('heading', { name: 'Thống kê thư viện.' })).toBeInTheDocument();
    expect(await screen.findByText('2 đầu sách · 3 bản còn lại')).toBeInTheDocument();
  });
});
