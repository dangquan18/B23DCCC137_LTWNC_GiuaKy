import { useFilterStore } from './useFilterStore';

describe('useFilterStore (Zustand)', () => {
  beforeEach(() => useFilterStore.getState().reset());

  it('setKeyword và setCategory cập nhật state (merge nông)', () => {
    useFilterStore.getState().setKeyword('clean');
    useFilterStore.getState().setCategory('CNTT');

    expect(useFilterStore.getState()).toMatchObject({ keyword: 'clean', category: 'CNTT' });
  });

  it('reset đưa bộ lọc về mặc định', () => {
    useFilterStore.getState().setKeyword('abc');
    useFilterStore.getState().reset();

    expect(useFilterStore.getState()).toMatchObject({ keyword: '', category: 'ALL' });
  });
});
