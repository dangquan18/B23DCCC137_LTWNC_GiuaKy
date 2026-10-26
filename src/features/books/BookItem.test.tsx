import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeBook } from '../../test-utils/factories';
import type { Book } from '../../types/book';
import BookItem from './BookItem';

const onBorrow = jest.fn();
const onReturn = jest.fn();

const renderItem = (override: Partial<Book> = {}, isBorrowed = false) =>
  render(
    <BookItem
      book={makeBook({ id: 'b42', ...override })}
      isBorrowed={isBorrowed}
      onBorrow={onBorrow}
      onReturn={onReturn}
    />,
  );

describe('BookItem', () => {
  afterEach(() => jest.clearAllMocks());

  it('hiển thị đúng thông tin sách', () => {
    renderItem({ title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3 });

    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('CNTT · 2008')).toBeInTheDocument();
    expect(screen.getByText('Còn 3 bản')).toBeInTheDocument();
  });

  it('click "Mượn" gọi onBorrow đúng 1 lần với đúng id', async () => {
    const user = userEvent.setup();
    renderItem();
    await user.click(screen.getByRole('button', { name: 'Mượn' }));
    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('b42');
  });

  it('nút "Mượn" bị vô hiệu hoá khi sách hết bản', async () => {
    const user = userEvent.setup();
    renderItem({ available: 0 });

    const button = screen.getByRole('button', { name: 'Mượn' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(onBorrow).not.toHaveBeenCalled();
  });

  it('sách đang mượn hiển thị nút "Trả" và gọi onReturn với đúng id', async () => {
    const user = userEvent.setup();
    renderItem({}, true);

    await user.click(screen.getByRole('button', { name: 'Trả' }));

    expect(onReturn).toHaveBeenCalledWith('b42');
  });

  it('không hiển thị nút "Trả" khi chưa mượn', () => {
    renderItem();
    expect(screen.queryByRole('button', { name: 'Trả' })).toBeNull();
  });
});
