import { isApiFailure, isApiSuccess } from '../types/api';
import { DEFAULT_DELAY, getBooks } from './booksApi';

describe('booksApi.getBooks', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('trả về { ok: true, data } sau độ trễ 500ms', async () => {
    const promise = getBooks();

    jest.advanceTimersByTime(DEFAULT_DELAY);
    const response = await promise;

    expect(isApiSuccess(response)).toBe(true);
    if (isApiSuccess(response)) {
      expect(response.data.length).toBeGreaterThan(0);
    }
  });

  it('trả về { ok: false, error } khi shouldFail = true', async () => {
    const promise = getBooks({ shouldFail: true });

    jest.advanceTimersByTime(DEFAULT_DELAY);
    const response = await promise;

    expect(isApiFailure(response)).toBe(true);
    if (isApiFailure(response)) {
      expect(response.error).toContain('Không thể tải');
    }
  });
});
