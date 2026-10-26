# Mini Library

Ứng dụng tra cứu và mượn/trả sách của thư viện khoa — React + TypeScript + Vite.

## Chạy dự án

```bash
npm install
npm run dev            # dev server
npm test               # Jest + React Testing Library
npm run test:coverage  # kèm báo cáo coverage (ngưỡng 70%)
npm run build          # type-check + build production
```

Giả lập API lỗi: mở `http://localhost:5173/?fail`, sau đó bấm **Thử lại**.

## Cấu trúc thư mục (feature-based / colocation)

```
src/
├── api/booksApi.ts              # API giả lập: Promise + setTimeout 500ms, tham số shouldFail
├── app/
│   ├── store.ts                 # configureStore + middleware, setupStore(), AppDispatch
│   ├── rootReducer.ts           # RootState
│   └── hooks.ts                 # useAppDispatch / useAppSelector
├── types/
│   ├── api.ts                   # ApiResponse<T> (discriminated union) + type guard
│   └── book.ts                  # Book, HasId, CategoryStats, BookSummary, isCategoryFilter
├── utils/collection.ts          # findById<T extends HasId>
├── hooks/useDebounce.ts         # useDebounce<T>
├── components/Header.tsx        # điều hướng + nút sáng/tối
├── features/
│   ├── books/
│   │   ├── booksSlice.ts        # createSlice + createAsyncThunk
│   │   ├── booksSelectors.ts    # selector + createSelector
│   │   ├── borrowLimitMiddleware.ts
│   │   ├── useFilteredBooks.ts  # custom hook: Redux + Zustand + debounce + useMemo
│   │   ├── bookUtils.ts
│   │   ├── BooksPage.tsx, BookList.tsx, CategorySection.tsx, BookItem.tsx, BorrowedDock.tsx, BorrowedItem.tsx
│   ├── filters/                 # useFilterStore (Zustand), SearchBar, CategoryFilterBar
│   ├── theme/                   # ThemeContext, ThemeProvider, useTheme
│   └── stats/StatsPage.tsx      # route /stats (React.lazy)
└── test-utils/                  # makeBook (factory), renderWithProviders
```

## Đối chiếu nội dung các buổi học

| Buổi | Áp dụng | Vị trí |
| --- | --- | --- |
| 1 — TS nâng cao | Generic + constraint `findById<T extends HasId>`; `ApiResponse<T>` là discriminated union theo `ok`; custom type guard `isApiSuccess`, `isApiFailure`, `isCategoryFilter`; utility types `Partial`, `Readonly`, `Pick`, `Record`, `Omit`; không dùng `any` | `types/`, `utils/collection.ts`, `api/booksApi.ts`, `test-utils/` |
| 2 — Custom hook | `useDebounce<T>`, `useFilteredBooks` (1 nhiệm vụ, trả interface có type, không phụ thuộc UI) | `hooks/`, `features/books/useFilteredBooks.ts` |
| 3 — Redux Toolkit | `createSlice` + `PayloadAction`, `createAsyncThunk` (pending/fulfilled/rejected), `status: 'idle' \| 'loading' \| 'succeeded' \| 'failed'`, typed hooks, `createSelector`, feature-based | `app/`, `features/books/` |
| 4 — Zustand, Context, middleware | Zustand `create<T>()` cho bộ lọc; Context tách riêng cho theme, `createContext<T \| null>(null)`, value bọc `useMemo`, `useTheme` ném lỗi ngoài Provider; middleware tự viết `store => next => action` nối bằng `getDefaultMiddleware().concat(...)` | `features/filters/`, `features/theme/`, `features/books/borrowLimitMiddleware.ts` |
| 5 — Hiệu năng | `useMemo` danh sách lọc; `React.memo` cho `BookItem`, `BookList`, `CategorySection`, `BorrowedItem`; handler `useCallback`, không hàm/object inline trong JSX; key = id; debounce 300ms; `React.lazy` + `Suspense` theo route | `features/books/`, `features/filters/`, `App.tsx` |
| 6 — Kiểm thử | `jest.config.ts` (`preset: 'ts-jest'`, `jsdom`, `setupFilesAfterEnv`), `jest.setup.ts`; reducer test bằng `toEqual`; RTL + `userEvent.setup()`; query `getByRole` → `getByText`, `queryBy` + `toBeNull`, `findBy`/`waitFor`; `jest.mock` + `mockResolvedValue`; fake timers; `renderHook`; `renderWithProviders` tạo store mới mỗi test; factory `makeBook`; mẫu AAA, `jest.clearAllMocks()` | `*.test.ts(x)`, `test-utils/` |

## Kiểm thử (34 test)

| File | Nội dung |
| --- | --- |
| `booksSlice.test.ts` | 10 test reducer: initial state, 3 trạng thái fetch, mượn/trả, trường hợp biên |
| `BookItem.test.tsx` | 5 test RTL + userEvent: hiển thị thông tin, click "Mượn" đúng id, disabled khi hết bản, nút "Trả" |
| `useDebounce.test.ts` | fake timers + `renderHook` |
| `App.test.tsx` | integration (mock API): loading → thành công / lỗi, lọc, tìm kiếm, mượn quá 3 cuốn, đổi theme, lazy `/stats` |
| `borrowLimitMiddleware.test.ts` | middleware chặn cuốn thứ 4 |
| `booksApi.test.ts`, `bookUtils.test.ts`, `useFilterStore.test.ts` | API giả lập, hàm lọc, store Zustand |
