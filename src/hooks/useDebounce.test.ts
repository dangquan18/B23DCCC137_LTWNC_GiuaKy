import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('chỉ cập nhật giá trị sau khi hết thời gian delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'react' },
    });
    expect(result.current).toBe('react');

    rerender({ value: 'redux' });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('react');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('redux');
  });
});
