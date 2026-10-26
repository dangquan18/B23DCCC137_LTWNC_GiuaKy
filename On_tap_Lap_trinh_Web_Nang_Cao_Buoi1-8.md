# ÔN TẬP — LẬP TRÌNH WEB NÂNG CAO (Buổi 1–8)

> Học phần: Lập trình Web nâng cao — GV Ngô Văn Nhận (PTIT/RIPT)
> Tóm tắt từ 8 bộ slide. Dùng file này làm "đề cương" để Claude ra đề kiểm tra.
> Lưu ý: slide Buổi 7 ghi "Kiểm tra giữa kỳ: nội dung Buổi 1–6"; slide Buổi 8 ghi "theo lịch của học phần" → ôn kỹ Buổi 1–6, nắm chắc cả Buổi 7–8.

---

## HƯỚNG DẪN CHO CLAUDE KHI RA ĐỀ

- Ra đề **chỉ dựa trên nội dung file này** (đúng thuật ngữ, ví dụ, bảng so sánh của slide).
- Dạng câu hỏi nên trộn: trắc nghiệm khái niệm, "chọn pattern/công cụ/chiến lược đúng cho tình huống", đọc code đoán kết quả/tìm lỗi, điền khuyết code, câu tự luận ngắn so sánh.
- Ưu tiên các **bảng so sánh**, mục **"Bẫy hay gặp"** và **"Câu hỏi tình huống"** ở cuối mỗi buổi.
- Chấm từng câu, giải thích đáp án, cuối bài tổng kết điểm và chỉ ra buổi cần ôn lại.

---

## BUỔI 1 — TYPESCRIPT NÂNG CAO CHO ỨNG DỤNG LỚN

**Vì sao cần:** nhiều thực thể (User, Product, Order) → type trùng lặp; API có cấu trúc bọc ngoài giống nhau; cần phân biệt biến thể (Admin/User, Draft/Published); thư viện JS không có type.

### 1. Generics
- **Constraint `extends`**: giới hạn T phải thoả điều kiện.
  ```ts
  interface HasId { id: string }
  function findById<T extends HasId>(items: T[], id: string): T | undefined {
    return items.find(x => x.id === id)
  }
  ```
- Nhiều tham số `<T, K>` để liên kết 2 kiểu.
- Ví dụ thực tế: `ApiResponse<T> { statusCode; message; data: T }`, `Paginated<T> { data/items: T[]; total }`, `class Repository<T extends HasId>` (nền tảng Service/Repository của NestJS).
- Lợi ích: **tái sử dụng code + giữ kiểm tra kiểu chặt chẽ**.

### 2. Utility Types dựng sẵn
| Utility | Công dụng |
|---|---|
| `Partial<T>` | mọi thuộc tính → tuỳ chọn (vd `UpdateUserDto = Partial<User>`) |
| `Required<T>` | mọi thuộc tính → bắt buộc |
| `Readonly<T>` | mọi thuộc tính → chỉ đọc |
| `Pick<T, K>` | chỉ lấy một số key K (vd `Pick<User,'name'|'email'>`) |
| `Omit<T, K>` | loại bỏ key K |
| `Record<K, V>` | object khoá kiểu K, giá trị kiểu V |

### 3. Mapped Types
- Cú pháp `{ [P in keyof T]: ... }` — duyệt từng key để tạo type mới.
  ```ts
  type MyReadonly<T> = { readonly [P in keyof T]: T[P] };
  type Nullable<T>   = { [P in keyof T]: T[P] | null };
  ```

### 4. Conditional Types & `infer`
- `T extends U ? X : Y` — kiểu kết quả phụ thuộc điều kiện.
- `infer` trích xuất kiểu con (vd kiểu trả về của hàm):
  ```ts
  type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;
  type UserType = ReturnOf<typeof getUser>;
  ```

### 5. Type Guards & Narrowing
- `typeof` / `instanceof`: kiểu nguyên thuỷ / class.
- **Custom type guard**: hàm trả về `x is T`.
- **Discriminated Union**: dùng thuộc tính chung (`role`, `type`) để phân biệt.
  ```ts
  type AdminUser = { role: 'admin'; permissions: string[] };
  type NormalUser = { role: 'user'; point: number };
  type AppUser = AdminUser | NormalUser;
  function isAdmin(u: AppUser): u is AdminUser { return u.role === 'admin'; }
  // if (isAdmin(u)) u.permissions  else u.point
  ```

### 6. Decorators
- Hàm đặc biệt gắn hành vi cho class/method/property (ký hiệu `@`).
- Cần `"experimentalDecorators": true` trong `tsconfig.json`.
- **Class decorator**: nhận constructor. **Method decorator**: nhận `(target, key, descriptor)`. **Property decorator**: nhận `(target, key)`.
- Là cơ chế cốt lõi của NestJS (`@Controller`, `@Injectable`).
  ```ts
  function Log(target: any, key: string, desc: PropertyDescriptor) {
    const original = desc.value;
    desc.value = function (...args: any[]) {
      console.log(`Gọi ${key} với`, args);
      return original.apply(this, args);
    };
  }
  function Readonly(target: any, key: string) {
    Object.defineProperty(target, key, { writable: false });
  }
  ```

### 7. Module, Namespace & `.d.ts`
- Mỗi file `.ts` có import/export là 1 **module** (chuẩn cho dự án lớn). **Namespace** gom nhóm logic (ít dùng hơn).
- Thư viện JS thuần không có type → khai báo trong `.d.ts`:
  ```ts
  declare module 'legacy-currency-lib' { export function formatVND(amount: number): string; }
  ```

**Bẫy hay gặp:** quên `experimentalDecorators`; dùng `any` tuỳ tiện; nhầm `Pick` (lấy) với `Omit` (bỏ); `useMemo`-style nhầm lẫn không liên quan ở đây; `infer` chỉ dùng được trong nhánh `extends` của conditional type.

**Câu hỏi tình huống mẫu:** Form cập nhật user → `Partial<User>`. Danh sách chỉ hiện tên + email → `Pick`. Bỏ `password` khỏi type trả về → `Omit<User,'password'>`. Map trạng thái → nhãn → `Record<Status, string>`.

---

## BUỔI 2 — KIẾN TRÚC & DESIGN PATTERN TRONG REACT

**Vấn đề:** nhiều component chung logic (auth, gọi API, phân trang) → copy-paste, khó bảo trì; trộn logic nghiệp vụ với UI → khó test, khó tái sử dụng.

### HOC (Higher-Order Component)
- **Hàm nhận 1 component, trả về component mới đã được tăng cường**: `const Enhanced = withSomething(Wrapped)`.
- Dùng cho logic chung: xác thực, log, inject dữ liệu, theme, tracking.
- TS: dùng generic `<P extends object>` + `React.ComponentType<P>` để giữ kiểu props.
  ```tsx
  function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function AuthWrapped(props: P) {
      const { user } = useAuth();
      if (!user) return <Navigate to="/login" />;
      return <Component {...props} />;
    };
  }
  ```
- Nhược: lồng nhiều lớp → **"wrapper hell"**, khó debug. Chỉ cần chia sẻ logic (không bọc UI) → dùng Custom Hook.

### Render Props
- Component nhận **prop dạng hàm** (`render` hoặc `children`) để quyết định UI. Cha lo logic, hàm truyền vào lo hiển thị.
- Linh hoạt hơn HOC (nơi gọi tự quyết định render gì). Nhược: lồng nhiều render prop → JSX khó đọc.
  ```tsx
  <MouseTracker render={pos => <p>{pos.x},{pos.y}</p>} />
  ```

| Tiêu chí | HOC | Render Props |
|---|---|---|
| Cách chia sẻ | Bọc component trong 1 hàm | Truyền hàm qua prop |
| Linh hoạt UI | Thấp (UI cố định trong HOC) | Cao |
| Vấn đề | Wrapper hell | Lồng nhiều → khó đọc JSX |
| Xu hướng | Dần thay bằng Custom Hook | Dần thay bằng Custom Hook |

### Compound Component
- Nhiều component nhỏ phối hợp thành 1 khối (vd `<Tabs><Tabs.List><Tabs.Tab/></Tabs.List><Tabs.Panel/></Tabs>`).
- Dùng **Context API** để các con "ngầm" chia sẻ state, không truyền props thủ công.
- Cài đặt: (1) `createContext<T | null>(null)`; (2) component cha `Provider` giữ state; (3) hook `useTabsContext()` ném lỗi nếu ctx null; (4) gán `Tabs.Tab = Tab`.
- Ưu điểm: API tự nhiên, linh hoạt sắp xếp lại phần con. Ví dụ: Tabs, Accordion, Menu.

### Custom Hooks nâng cao
- Hàm bắt đầu bằng `use`, kết hợp các hook cơ bản thành hook nghiệp vụ.
- **4 nguyên tắc thiết kế tốt:** Single Responsibility; trả về interface rõ ràng có type đầy đủ; **không phụ thuộc UI**; dễ test độc lập (`renderHook`).
  ```ts
  function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null } {
    // 3 state + useEffect(fetch, [url])
  }
  const { data, loading, error } = useFetch<Product[]>('/api/products');
  ```
- BTVN: `usePagination<T>` nhận `T[]` + số item/trang → trả trang hiện tại, tổng trang, `next/prev/goToPage`.

### Bảng chọn pattern
| Tình huống | Pattern |
|---|---|
| Chia sẻ logic, không kèm UI cố định | **Custom Hook** |
| Bọc nhiều component bằng 1 logic chung (auth, tracking) | **HOC** |
| Cần linh hoạt hoàn toàn phần hiển thị | **Render Props** |
| Nhóm nhiều component nhỏ thành 1 khối UI (Tabs, Accordion) | **Compound Component** |

→ React hiện đại **ưu tiên Custom Hook** cho hầu hết bài toán chia sẻ logic.

---

## BUỔI 3 — REDUX TOOLKIT + TYPESCRIPT

**Vì sao cần state tập trung:** prop drilling; Context làm **mọi con của Provider re-render** khi value đổi; Context + useReducer khó tổ chức khi state phức tạp/bất đồng bộ/cần debug. RTK = bộ công cụ chính thức, ít boilerplate, **tích hợp Immer**, hợp TypeScript.

### configureStore & createSlice
- `configureStore()` thay `createStore()` cũ: **tự gộp middleware (có sẵn redux-thunk), tự bật Redux DevTools**.
- `createSlice()` gộp 3 thứ: **initialState + reducer + action creator** (action tự sinh).
- **Immer**: viết `state.value += 1` / `state.items.push(...)` trông như mutate nhưng vẫn ra state mới immutable.
- TS: interface cho state, `PayloadAction<T>` cho `action.payload`.
  ```ts
  const cartSlice = createSlice({
    name: 'cart', initialState,
    reducers: { addItem(state, action: PayloadAction<CartItem>) { state.items.push(action.payload); state.totalQuantity += 1; } },
  });
  export const store = configureStore({ reducer: { cart: cartReducer, auth: authReducer } });
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  ```
- Mỗi phần state độc lập nghiệp vụ → 1 slice riêng; **không gộp toàn app vào 1 slice**. RootState/AppDispatch **suy ra tự động**, không viết tay.

### createAsyncThunk
- `createAsyncThunk<ReturnType, ArgType>(typePrefix, payloadCreator)` → tự sinh **3 trạng thái: pending, fulfilled, rejected**.
- Xử lý trong `extraReducers: (builder) => builder.addCase(fetchX.pending, ...)...`.
- `action.payload` ở fulfilled được suy đúng kiểu; lỗi ở `action.error.message`.
- `status: 'idle' | 'loading' | 'succeeded' | 'failed'` (union literal).
- Thay thế việc tự viết loading/error như `useFetch` Buổi 2.

### Cấu trúc thư mục feature-based (colocation)
```
src/app/store.ts, hooks.ts
src/features/auth/authSlice.ts, LoginForm.tsx
src/features/cart/cartSlice.ts, CartSummary.tsx
src/features/products/productsSlice.ts, productsApi.ts, ProductList.tsx
```
- Gom theo **tính năng**, không theo loại file (components/, reducers/, actions/ như Redux cũ). Lợi ích: dễ tìm, dễ xoá/tách feature, giảm xung đột khi làm nhóm. Quy ước: `<feature>Slice.ts`, `use<Feature>.ts`.

### Typed hooks
```ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
- `useSelector/useDispatch` gốc không biết kiểu RootState/AppDispatch → phải ép kiểu khắp nơi. Quy tắc: **component chỉ import useAppSelector/useAppDispatch**. Gõ sai field (`state.cart.itmes`) báo lỗi lúc biên dịch.

### RTK Query
- Module con của RTK chuyên **data fetching + caching**. `createApi({ reducerPath, baseQuery: fetchBaseQuery({baseUrl}), endpoints })` → **tự sinh hook** (`useGetProductsQuery`).
- Tự cache theo tham số, tự refetch khi invalidate tag, tự quản lý loading/error. Thêm reducer + middleware của api vào store.

| Tiêu chí | createAsyncThunk | RTK Query |
|---|---|---|
| Viết code | Tự viết slice, 3 trạng thái, selector | Khai báo endpoint, hook tự sinh |
| Cache | Không có sẵn | Tự cache theo tham số |
| Refetch | Tự viết | Tự động khi invalidate tag |
| Phù hợp | Logic nghiệp vụ phức tạp trong reducer | App chủ yếu CRUD REST |

### Middleware & DevTools
- Middleware = lớp trung gian **giữa `dispatch(action)` và reducer**. Thêm bằng `getDefaultMiddleware().concat(...)`.
- Redux DevTools: lịch sử action + state trước/sau, **time-travel debugging**.

| Tiêu chí | Context + useReducer | Redux Toolkit |
|---|---|---|
| Quy mô | Nhỏ–vừa | Vừa–lớn |
| Bất đồng bộ | Tự viết loading/error | createAsyncThunk 3 trạng thái |
| Debug | Không có sẵn | DevTools, time-travel |
| Boilerplate | Ít nhưng khó mở rộng | Đã tối giản nhờ createSlice |

---

## BUỔI 4 — ZUSTAND, CONTEXT NÂNG CAO & MIDDLEWARE

### Zustand
- Triết lý tối giản: state bằng **1 hook thuần, KHÔNG Provider, KHÔNG action type, KHÔNG reducer tách rời**.
- `create<T>()(...)` tạo hook store; **state và actions chung 1 object**.
- `set()` cập nhật — **mặc định merge nông** (không cần return toàn bộ state). `get()` đọc state hiện tại trong action.
  ```ts
  export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  }));
  const items = useCartStore((s) => s.items); // selector → chỉ re-render đúng phần subscribe
  ```
- Gọi action như hàm thường (không `dispatch`). Import store ở bất kỳ đâu.
- Async: chỉ là **hàm async gọi `set()`**, tự quản lý `status/error` — **không có sẵn** pending/fulfilled/rejected tự động, không có DevTools tích hợp sẵn như RTK.

### Context nâng cao — kiểm soát re-render
- **Kỹ thuật 1 — Tách nhỏ Context**: UserContext, ThemeContext riêng thay vì 1 AppContext.
- **Kỹ thuật 2 — `useMemo` cho value của Provider**: nếu không, object value tạo mới mỗi lần cha render → mọi children re-render.
  ```tsx
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  ```
- Kết hợp `React.memo` cho con.
- Quy tắc: **Context cho state toàn cục ít thay đổi** (theme, ngôn ngữ); **Zustand/Redux cho state thay đổi thường xuyên & phức tạp**.

### useReducer + Context = "mini-Redux"
- `useReducer` theo pattern action/reducer; Context "phát" `{state, dispatch}` xuống cây con. Vẫn cần `useMemo` cho value.
- Action dùng **discriminated union**: `{type:'add'; payload: CartItem} | {type:'remove'; payload: string}`.
- Không cần thư viện ngoài nhưng **không DevTools, không middleware** → chỉ cho state cỡ vừa.

### Middleware Redux
- **redux-thunk**: cho phép **dispatch 1 HÀM**; middleware gọi hàm đó với `(dispatch, getState)`. `configureStore` tự thêm thunk → đây là lý do `createAsyncThunk` chạy được.
  ```js
  const thunk = ({ dispatch, getState }) => (next) => (action) =>
    typeof action === 'function' ? action(dispatch, getState) : next(action);
  ```
- **redux-logger**: in mỗi action + state trước/sau; `middleware: (getDefault) => getDefault().concat(logger)`. **Chỉ bật ở development**.
- **redux-saga**: side-effect bằng **generator `function*`** với effect `call`, `put`, `take` — "mô tả" effect để middleware thực thi; dễ test hơn, learning curve cao; dùng khi side-effect phức tạp (huỷ tác vụ, chạy song song có điều kiện).

### Bảng tiêu chí lựa chọn
| Tiêu chí | Context nâng cao | Zustand | Redux Toolkit |
|---|---|---|---|
| Quy mô team | Cá nhân/nhóm nhỏ | Nhóm nhỏ–vừa | Vừa–lớn |
| Độ phức tạp state | Đơn giản, ít thay đổi | Vừa phải | Phức tạp, nhiều slice |
| Hiệu năng | Dễ re-render thừa nếu không tách | Tốt, re-render đúng phần subscribe | Tốt, tối ưu bằng selector |
| Learning curve | Thấp | **Rất thấp** | Trung bình–cao |

**Cho đồ án:** RTK cho state nghiệp vụ chính (an toàn nhất); Zustand cho state UI phụ (modal, tab); Context cho theme/ngôn ngữ/thông tin đăng nhập ít đổi. **Không bắt buộc chỉ 1 công cụ.**

---

## BUỔI 5 — TỐI ƯU HIỆU NĂNG REACT

**Nguyên tắc vàng: "Đo trước, tối ưu sau" (measure, don't guess).** Memo hoá khắp nơi có thể chậm hơn vì bản thân memo cũng có chi phí.

### Cơ chế render
- State/props đổi → **Render** (gọi lại hàm, tạo Virtual DOM mới) → **Reconciliation/Diff** → **Commit** chỉ phần khác vào DOM thật. "Render" ≠ DOM thật chắc chắn đổi.
- Nguyên nhân re-render thừa: state cha đổi (cả cây con render lại theo mặc định); props đổi **tham chiếu** (object/array/hàm tạo mới); Context đổi; cha render → mọi con render trừ khi bọc `React.memo`.

### 3 kỹ thuật memoization
| | React.memo | useMemo | useCallback |
|---|---|---|---|
| Ghi nhớ | Kết quả render của **component** | 1 **giá trị** | 1 **hàm** (tham chiếu) |
| Áp dụng | Bọc ngoài component | Biến trong component | Hàm trong component |
| Cú pháp | `React.memo(Comp, arePropsEqual?)` | `useMemo(() => v, deps)` | `useCallback(fn, deps)` |
| Dùng khi | Props ổn định, render tốn | Tính toán tốn (lọc, sort) | Truyền callback xuống con đã memo |

- `React.memo` so sánh **nông (shallow)**; tham số 2 `arePropsEqual(prev, next)` trả **true = coi như giống, KHÔNG render lại**.
- **`useMemo` KHÔNG ngăn component render lại** — chỉ tránh tính lại giá trị.
- `useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`.
- Con bọc `React.memo` nhưng prop hàm tạo mới mỗi lần → **memo vô tác dụng** → phải `useCallback`.
- Tránh lạm dụng: phép tính đơn giản / component render rất nhanh / props luôn đổi → memo vô nghĩa.

### Code-splitting
- `React.lazy(() => import('./Page'))` + `<Suspense fallback={...}>` → tách chunk, tải khi cần. Phổ biến nhất: **theo route**.
- Ví dụ số liệu: bundle chính ~850KB → ~320KB; TTI 3G ~4.2s → ~1.8s. Cải thiện rõ nhất **lần tải đầu**.
- `React.lazy` **không hỗ trợ SSR** → `@loadable/component`. Đặt tên chunk: magic comment `/* webpackChunkName: "checkout" */`.

### Virtualization (windowing)
- Chỉ render phần tử **trong viewport** (+ vùng đệm). Thư viện: `react-window` (`FixedSizeList` với `height, width, itemCount, itemSize`, render `({index, style})`), `react-virtualized`, `@tanstack/react-virtual`.
- 10.000 dòng: ~10.000 node → ~15–20 node; render ~1.800ms → ~45ms; cuộn ~60 FPS.

| Thư viện | Ưu | Nhược |
|---|---|---|
| react-window | Nhẹ (~2KB), API đơn giản | Ít tính năng, không grid phức tạp |
| react-virtualized | Đầy đủ (List, Grid, Table, Masonry) | Nặng (~30KB), API phức tạp |
| @tanstack/react-virtual | Headless, linh hoạt, React 18+ | Phải tự code UI |

### Công cụ đo
- **React DevTools Profiler**: flame graph (thanh dài/vàng-đỏ = chậm), "Why did this render?", "Highlight updates". Đo **từng component lúc tương tác**.
- **Lighthouse**: 4 hạng mục **Performance, Accessibility, Best Practices, SEO**; chỉ số **FCP, LCP, TBT, CLS**. Đo **trải nghiệm tải trang tổng thể**; đo ở chế độ ẩn danh.
- **Bundle**: `source-map-explorer` (đọc file .map), `webpack-bundle-analyzer` (tích hợp build). Hay phát hiện import cả lodash cho 1 hàm.
- **why-did-you-render** (log re-render thừa lúc dev) và **web-vitals** (đo LCP, CLS, INP ở production trên máy người dùng thật).

### Best practice
- Tránh object/hàm **inline trong JSX** (`style={{...}}`, `onClick={() => ...}`) → khai báo hằng ngoài component hoặc useMemo/useCallback.
- **Key**: không dùng index khi list thêm/xoá/sắp xếp; dùng id ổn định.
- Tách state đúng phạm vi: chỉ 1 component cần → `useState` local.
- **Debounce**: chạy SAU KHI ngừng thao tác (ô tìm kiếm). **Throttle**: chạy đều theo chu kỳ (scroll, resize).
- Liên hệ: selector nhỏ trong `useAppSelector`; **`createSelector` (Reselect)** ghi nhớ selector ở tầng store.

---

## BUỔI 6 — KIỂM THỬ FRONTEND VỚI TYPESCRIPT (Jest, RTL)

**TypeScript bắt lỗi kiểu, test bắt lỗi hành vi.** Mục tiêu: chống regression.

### Kim tự tháp kiểm thử
| | Unit | Integration | E2E |
|---|---|---|---|
| Phạm vi | Hàm, reducer, hook | Component + state + API giả | Toàn luồng người dùng |
| Tốc độ | Mili-giây | Vài chục–vài trăm ms | Vài giây–phút |
| Công cụ | Jest | Jest + RTL | Cypress, Playwright |
| Ổn định | Rất cao | Cao | Dễ flaky |
→ Nhiều unit, vừa đủ integration, ít E2E cho kịch bản sống còn (đăng nhập, thanh toán).

### Jest + TypeScript
- Cài: `jest ts-jest @types/jest jest-environment-jsdom`; `jest.config.ts`: `preset: 'ts-jest'`, `testEnvironment: 'jsdom'`, `setupFilesAfterEnv`. Dự án Vite có thể dùng **Vitest**.
- `describe` gom nhóm, `it/test` mô tả hành vi, `expect(...).matcher()`. File test cạnh code: `cart.ts ↔ cart.test.ts`.

| Matcher | Ý nghĩa |
|---|---|
| `toBe` | `===`, kiểu nguyên thuỷ |
| `toEqual` | so sánh **sâu** object/array |
| `toBeNull` / `toBeTruthy` | null / truthy |
| `toContain` | mảng/chuỗi chứa phần tử |
| `toThrow` | hàm ném lỗi |
| `toHaveBeenCalledWith` / `toHaveBeenCalledTimes` | hàm mock được gọi với tham số / số lần |

### Mocking
- `jest.fn()` hàm giả (ghi số lần gọi, tham số); `jest.spyOn(obj,'method')` theo dõi/thay tạm, nhớ `mockRestore()`.
- `jest.mock('./api')` thay cả module; `mockResolvedValue` (thành công) / `mockRejectedValue` (lỗi); ép kiểu `as jest.MockedFunction<typeof fn>`.
- **MSW** (Mock Service Worker) chặn ở tầng mạng — sát thực tế hơn.
- **Fake timers**: `jest.useFakeTimers()` → `jest.advanceTimersByTime(ms)` → `jest.useRealTimers()` sau cùng.

### React Testing Library
- Triết lý: **test giống cách người dùng dùng** — tìm theo role, label, text; không theo state/class. Refactor mà hành vi không đổi → test vẫn xanh. Chạy trong **jsdom**.
- 3 gói: `@testing-library/react` (render, screen, renderHook), `@testing-library/jest-dom` (matcher, import 1 lần ở `jest.setup.ts`), `@testing-library/user-event`.

| Query | Không tìm thấy | Dùng khi |
|---|---|---|
| `getBy…` | **Ném lỗi ngay** | Phần tử chắc chắn có |
| `queryBy…` | **Trả null** | Khẳng định KHÔNG xuất hiện |
| `findBy…` | Ném lỗi sau timeout; **trả Promise (await)** | Xuất hiện bất đồng bộ |
Thêm `All` khi nhiều phần tử.

- **Thứ tự ưu tiên query:** `getByRole` (cao nhất, kiểm luôn accessibility) → `getByLabelText` (ô form) → `getByText` → `getByTestId` (cuối cùng). `screen.debug()` in DOM.
- `userEvent` (luôn `await`, `userEvent.setup()`) sát người dùng hơn `fireEvent`.
- jest-dom: `toBeInTheDocument`, `toBeVisible`, `toBeDisabled`, `toHaveTextContent`, `toHaveValue`.
- Factory dữ liệu mẫu: `makeProduct(override: Partial<Product> = {})`.

### Bất đồng bộ, hook, Redux
- `findBy` = getBy + chờ (mặc định ~1s); `waitFor(() => expect(...))`. Test đủ **loading / thành công / lỗi**. **Không dùng setTimeout/sleep** trong test.
- Hook: `renderHook(() => useX())`, đọc `result.current`, đổi state trong `act()`.
- Reducer RTK là **hàm thuần** → `reducer(state, action)` rồi `toEqual`; test biên (xoá id không tồn tại, thêm trùng, giỏ rỗng).
- Component dùng Redux → `renderWithProviders(ui, preloadedState)`: **mỗi test tạo store MỚI**; kiểm tra qua UI.
- Zustand: gọi action rồi đọc `getState()`.

### Coverage & best practice
- `npx jest --coverage` → 4 chỉ số: **Statements, Branches, Functions, Lines**. Coverage chỉ cho biết dòng nào chưa chạy — **100% ≠ không lỗi**. Ngưỡng hợp lý 70–80% qua `coverageThreshold`.
- **Nên test**: hành vi nhìn thấy, logic nghiệp vụ (tính tổng, validate, reducer), nhánh lỗi/biên, luồng quan trọng. **Không nên**: state nội bộ, thư viện bên thứ 3, chi tiết UI bằng snapshot lớn, code chỉ truyền props.
- Mẫu **AAA: Arrange – Act – Assert**; mỗi test 1 hành vi; tên mô tả tự nhiên; test độc lập, `afterEach(() => jest.clearAllMocks())`.

---

## BUỔI 7 — NEXT.JS: SSR, SSG, ISR & APP ROUTER

**Hạn chế React thuần (SPA/CSR):** HTML gần rỗng `<div id="root">` → tải đầu chậm, **SEO yếu**; phải tự ghép router, bundler, server. Next.js = **framework full-stack xây trên React** (vẫn JSX/hook/component).

### So sánh React thuần vs Next.js (App Router)
| | React thuần | Next.js |
|---|---|---|
| Bản chất | Thư viện UI | Framework full-stack |
| Rendering | Chủ yếu CSR | CSR/SSR/SSG/ISR theo **từng trang** |
| Routing | React Router thủ công | Theo **thư mục** (file-system) |
| SEO | Khó | Tốt (Metadata API, sitemap) |
| Lấy dữ liệu | useEffect/React Query | async/await trong Server Component |
| Ảnh/Font | Tự làm | `next/image`, `next/font` |
| Backend | Server riêng | Route Handlers, Server Actions |
| Code-splitting | Tự React.lazy | Tự động theo route |

- Khởi tạo: `npx create-next-app@latest my-shop --typescript`; `app/layout.tsx` (root, bắt buộc), `app/page.tsx` ("/"), `public/`, `next.config.ts`. **Mặc định mọi component trong app/ là Server Component.**

### 4 chiến lược render
| | HTML tạo khi nào | Độ mới | Phù hợp | Hạn chế |
|---|---|---|---|---|
| **CSR** | Trên trình duyệt | Luôn mới | Dashboard sau đăng nhập | SEO kém, tải đầu chậm |
| **SSR** | **Mỗi request** | Luôn mới | Trang cá nhân hoá, dữ liệu đổi liên tục | Tốn server, TTFB cao |
| **SSG** | **Lúc build** | Cố định tới lần build sau | Blog, tài liệu, landing | Đổi nội dung phải build lại |
| **ISR** | Build + **tái tạo nền theo chu kỳ** | Cũ tối đa N giây | Danh mục sản phẩm, tin tức | Có thể thấy dữ liệu cũ N giây |

- SSR: hydrate = JS tải sau để gắn sự kiện. View page source để xem HTML bot nhận được (khác tab Elements).
- **SSR**: `fetch(url, { cache: 'no-store' })` hoặc dùng `cookies()/headers()` → trang dynamic.
- **SSG**: `fetch(url, { cache: 'force-cache' })`; `generateStaticParams()` liệt kê các `[id]` sinh sẵn. **Next.js 15: fetch mặc định KHÔNG cache.**
- **ISR** = SSG + revalidate: `export const revalidate = 60;` (theo thời gian) hoặc `revalidatePath('/products')` trong Server Action (theo yêu cầu). Request đầu sau hết hạn **vẫn nhận bản cũ (stale)**, nền tạo bản mới cho lần sau.
- Next.js 15: `params` là **Promise** → `const { id } = await params`.
- Build output: `○ Static`, `● SSG`, `ƒ Dynamic`.

| Loại trang | Chiến lược |
|---|---|
| Trang chủ, giới thiệu, landing | SSG |
| Danh mục & chi tiết sản phẩm | ISR |
| Blog, tài liệu | SSG (+ISR nếu hay sửa) |
| Kết quả tìm kiếm, giỏ hàng, trang cá nhân | SSR hoặc CSR |
| Dashboard sau đăng nhập | CSR (Client Component) |
Thứ tự ưu tiên: **SSG → ISR → SSR → CSR** (từ nhanh/rẻ đến linh hoạt).

### App Router
- Mỗi thư mục = 1 đoạn URL; chỉ truy cập được khi có `page.tsx`.

| File | Vai trò |
|---|---|
| `page.tsx` | UI của route |
| `layout.tsx` | Khung chung, **không mount lại** khi chuyển trang con (giữ state) |
| `loading.tsx` | UI tạm, tự bọc Suspense |
| `error.tsx` | Error Boundary theo route |
| `not-found.tsx` | 404, gọi bằng `notFound()` |
| `template.tsx` | Như layout nhưng **mount lại** mỗi lần điều hướng |

| Dynamic route | URL khớp | params |
|---|---|---|
| `[id]` | `/products/42` | `{ id: '42' }` |
| `[...slug]` | `/docs/a/b` (**không** khớp `/docs`) | `{ slug: ['a','b'] }` |
| `[[...slug]]` | `/shop`, `/shop/a`, `/shop/a/b` | `{ slug?: string[] }` |

| Quy ước | Tác dụng |
|---|---|
| `(group)` | Gom nhóm/layout riêng, **không thêm vào URL** |
| `_folder` | Thư mục riêng tư, không thành route |
| `@slot` | Parallel route |
| `(.)folder` | Intercepting route (modal xem nhanh) |

- Điều hướng: `<Link>` (client-side, tự **prefetch** ở production); `useRouter`, `usePathname` **chỉ trong Client Component**; Server Component dùng `redirect()`, `notFound()`.

### Server vs Client Component
| | Server (mặc định) | Client (`'use client'`) |
|---|---|---|
| Chạy ở | Server, không gửi JS | Trình duyệt (sau hydrate) |
| useState/useEffect | ✕ | ✓ |
| onClick, window, localStorage | ✕ | ✓ |
| Gọi DB/API có khoá bí mật | ✓ (không lộ) | Không nên |
| JS gửi về | 0 KB | Tăng theo số Client Component |
- Nguyên tắc: Server Component mặc định; `'use client'` chỉ ở **"lá"** cần tương tác. Có thể truyền Server Component làm `children` vào Client Component.
- Redux/Zustand/Context **chỉ chạy trong Client Component** → Provider trong file `'use client'`, bọc ở layout. **Tránh store singleton** (bị dùng chung giữa user trên server) → `makeStore()` mỗi request (`useRef`).
- Streaming: server gửi HTML theo từng phần; bọc phần chậm trong `<Suspense>`.
- Backend: **Route Handler** `app/api/.../route.ts` export `GET/POST` trả `NextResponse.json()`; **Server Action** `'use server'` gọi từ `<form action={...}>` + `revalidatePath`.

### SEO & tối ưu
- `export const metadata: Metadata` (tĩnh) / `generateMetadata()` (động) → `<head>` render sẵn trên server (React thuần dùng react-helmet phía client).
- `openGraph` (ảnh/tiêu đề khi share Facebook/Zalo), `sitemap.ts` → `/sitemap.xml`, `robots.ts` → `/robots.txt`.
- **JSON-LD** (schema.org) trong `<script type="application/ld+json">`; escape `<` thành `<` để chống XSS.
- `next/image`: resize, WebP/AVIF, lazy, width/height chống CLS. `next/font`: tự host, không nhấp nháy/lệch.
- Đo Lighthouse trên **production** (`npm run build && npm start`), **không đo trên `npm run dev`**.

**Lỗi thường gặp:** (1) dùng hook/onClick trong Server Component — thiếu `'use client'`; (2) **hydration mismatch** (Date.now(), window, Math.random()); (3) SSG không tự cập nhật nếu thiếu revalidate; (4) đo hiệu năng trên dev.

**Chọn Next.js khi:** cần SEO (TMĐT, tin tức, blog), tải đầu nhanh, API nhẹ + form, nội dung làm mới định kỳ. **React thuần hợp lý khi:** app nội bộ/dashboard không cần SEO, prototype, đã có backend riêng, nhúng widget.

---

## BUỔI 8 — NEXT.JS NÂNG CAO: XÁC THỰC, MIDDLEWARE, SEO

### Thuật ngữ
- **Authentication (xác thực)**: "Bạn là ai?" — làm TRƯỚC.
- **Authorization (phân quyền)**: "Bạn được làm gì?" — làm SAU.
- **JWT**: token ký số chứa id, vai trò, hạn dùng — Auth.js dùng mặc định.
- **OAuth**: đăng nhập bằng tài khoản có sẵn (Google, GitHub), không chia sẻ mật khẩu.

| | Session (server) | JWT |
|---|---|---|
| Lưu trạng thái | Server (bộ nhớ/Redis/DB); cookie chỉ chứa mã phiên | Trong token ở cookie; server không lưu |
| Thu hồi | Dễ | Khó (chờ hết hạn / blacklist) |
| Nhiều server | Cần chia sẻ kho phiên | Dễ |
| Cookie | Rất nhỏ | Lớn hơn |
| Auth.js | Khi có database adapter | Mặc định khi không có DB; **bắt buộc với Credentials** |
Cookie phiên: **httpOnly, Secure, SameSite**.

| | React thuần | Next.js |
|---|---|---|
| Lưu token | localStorage — dễ bị **XSS** | Cookie **httpOnly** |
| Chặn trang | Route guard trình duyệt, có thể bị bỏ qua | Middleware/Server Component **trước khi render** |
| Trải nghiệm | Nháy giao diện | Redirect từ server |
| Biết user | Gọi API /me | `auth()` trong Server Component |

### NextAuth (Auth.js v5)
- `npm install next-auth@beta`; `npx auth secret` → `AUTH_SECRET` vào `.env.local` (**không commit**).
- `auth.ts` export `{ handlers, auth, signIn, signOut }`; providers: `GitHub`, `Credentials({ authorize })` (trả user hoặc null); `session: { strategy: 'jwt' }`.
- Route handler: `app/api/auth/[...nextauth]/route.ts` → `export const { GET, POST } = handlers;`. Callback URL GitHub: `http://localhost:3000/api/auth/callback/github`.
- Đọc phiên: Server → `await auth()`; Client → `SessionProvider` + `useSession()` (`status: 'loading' | 'authenticated' ...`). **Ưu tiên `auth()` ở server.**
- Đăng nhập/đăng xuất: `signIn('github', { redirectTo })`, `signIn('credentials', {...})` trong Server Action.
- **Callbacks**: `jwt({token, user})` gắn id/role vào token (user chỉ có lúc đăng nhập); `session({session, token})` quyết định `session.user`. Chỉ đưa thứ cần thiết vào token.
- TS **module augmentation** trong `types/next-auth.d.ts`: `declare module 'next-auth' { interface User { role: Role }; interface Session {...} }` và `declare module 'next-auth/jwt' { interface JWT {...} }`; `Role = 'admin' | 'user'`.

| Provider | Khi nào | Lưu ý |
|---|---|---|
| Credentials | Tự quản lý tài khoản | Băm mật khẩu (bcrypt/argon2), chống dò, bắt buộc JWT |
| OAuth | Đăng nhập nhanh | Đăng ký app, callback URL, giữ client secret |
| Email (magic link) | Không mật khẩu | Cần dịch vụ mail + database adapter |

### Middleware
- Chạy **TRƯỚC** khi request tới route; file `middleware.ts` cùng cấp `app/` (bản mới đổi tên **`proxy.ts`**).
- `config.matcher` chỉ chạy ở đường dẫn cần (`['/dashboard/:path*', '/admin/:path*']`).
- `NextRequest` đọc cookie/header/URL; `NextResponse.redirect()` (**đổi URL**), `rewrite()` (**giữ URL**, hiển thị nội dung route khác), `next()`.
- Chỉ kiểm tra nhẹ, **không truy vấn DB**. Chạy ở **Edge Runtime** → không dùng bcrypt/DB → tách `auth.config.ts` (nhẹ) và `auth.ts` (đầy đủ).
- `export default auth((req) => { if (!req.auth && isPrivate) return Response.redirect(...) })`.
- Ứng dụng: bảo vệ trang riêng tư, phân quyền (user vào /admin → /403), đa ngôn ngữ (Accept-Language), A/B testing (rewrite), thêm header bảo mật (CSP, X-Frame-Options).

### Phân quyền & bảo mật
- **Defense in depth (4 lớp):** 1) Middleware (chặn sớm, thô) → 2) Page/Server Component (`auth()` trước khi lấy dữ liệu) → 3) Server Action/Route Handler (kiểm tra lại quyền + input mỗi thao tác ghi) → 4) Tầng dữ liệu (lọc theo userId, không tin ID từ client). Quy tắc: **kiểm tra quyền ở NƠI dữ liệu được đọc/ghi.** Middleware từng có lỗ hổng năm 2025.
- **RBAC**: User → Role → Permission (quyền gắn vai trò, không gắn từng người).

| Hành động | guest | user | admin |
|---|---|---|---|
| Xem sản phẩm | ✓ | ✓ | ✓ |
| Thêm giỏ / Đặt hàng | ✕ | ✓ | ✓ |
| Sửa / Xoá sản phẩm | ✕ | ✕ | ✓ |
| Quản lý người dùng | ✕ | ✕ | ✓ |

```ts
const permissions: Record<Role, Action[]> = {
  guest: ['product:read'], user, admin: [...user, 'product:write', 'user:manage'],
};
export const can = (role: Role, action: Action) => permissions[role].includes(action);
```
- Chưa đăng nhập → `/login` (**401**); đăng nhập nhưng thiếu quyền → `/403` (**403**).
- Layout không render lại khi chuyển trang con → **đặt kiểm tra trong từng page/tầng dữ liệu, không chỉ layout**.
- **Server Action là endpoint công khai** → luôn kiểm tra phiên + vai trò bên trong; validate input bằng **zod**. Ẩn nút "Xoá" chỉ là UX, không phải bảo mật.

| Rủi ro | Cách phòng |
|---|---|
| XSS | React tự escape; hạn chế `dangerouslySetInnerHTML`; header CSP |
| CSRF | Cookie SameSite; Server Action kiểm tra Origin; không dùng GET để thay đổi dữ liệu |
| Lộ khoá | Biến **không có tiền tố `NEXT_PUBLIC_`** chỉ ở server; gói `server-only` |
| Mật khẩu | Băm bcrypt/argon2, không log |

### SEO nâng cao & Core Web Vitals
| Chỉ số | Ý nghĩa | Tốt |
|---|---|---|
| **LCP** | Hiển thị phần tử nội dung lớn nhất | ≤ 2,5 s |
| **CLS** | Mức nhảy bố cục | ≤ 0,1 |
| **INP** | Độ trễ phản hồi tương tác | ≤ 200 ms |

- `metadataBase` + `title: { default, template: '%s | My Shop' }`; **canonical** (URL chính thức, tránh trùng `?sort=`, `?utm_`); `alternates.languages` → **hreflang**; `robots: { index: false }` (noindex) cho trang riêng tư.
- `opengraph-image.tsx` + `ImageResponse` (`next/og`) → ảnh 1200×630 động cho từng trang.
- Structured data: **Product+Offer** (giá, còn hàng, sao), **Article**, **BreadcrumbList**, **Organization**. Kiểm tra bằng Rich Results Test.
- Tối ưu: LCP → next/image, SSG/ISR, giảm JS chặn; CLS → width/height ảnh, next/font; INP → giảm JS client, `next/dynamic` (`ssr: false`), `next/script` (`strategy="lazyOnload"`).
- Công cụ: View source/curl, Lighthouse, PageSpeed Insights, Google Search Console, Rich Results Test.

---

## TỔNG HỢP "CHỌN CÁI GÌ CHO TÌNH HUỐNG NÀO" (dễ ra đề)

| Tình huống | Đáp án |
|---|---|
| Form cập nhật, mọi field tuỳ chọn | `Partial<T>` |
| Lấy kiểu trả về của hàm | Conditional type + `infer` (hoặc `ReturnType`) |
| Phân biệt union theo `role` | Discriminated union + custom type guard `u is T` |
| Thư viện JS không có type | File `.d.ts` với `declare module` |
| Bọc nhiều trang bằng kiểm tra đăng nhập | HOC `withAuth` (hoặc Middleware ở Next.js) |
| Tabs/Accordion các phần con chia sẻ state | Compound Component + Context |
| Chia sẻ logic gọi API | Custom Hook `useFetch<T>` |
| State nghiệp vụ lớn, nhóm đông, cần debug | Redux Toolkit |
| App chủ yếu CRUD REST, cần cache | RTK Query |
| State UI nhỏ (modal, tab) | Zustand |
| Theme/ngôn ngữ ít đổi | Context (+ useMemo, tách nhỏ) |
| Ghi log mọi action | redux-logger (chỉ dev) |
| Side-effect phức tạp, huỷ tác vụ | redux-saga |
| Lọc danh sách lớn theo keyword | `useMemo` (+ debounce) |
| Truyền callback xuống con đã `React.memo` | `useCallback` |
| Danh sách 10.000 dòng | Virtualization (react-window) |
| Bundle đầu quá nặng | Code-splitting theo route (`React.lazy` + `Suspense`) |
| Tìm nguyên nhân re-render | React DevTools Profiler |
| Đo điểm tải trang | Lighthouse |
| Test reducer | Gọi reducer trực tiếp + `toEqual` |
| Khẳng định phần tử không xuất hiện | `queryBy…` + `toBeNull()` |
| Phần tử hiện sau khi gọi API | `await findBy…` / `waitFor` |
| Test debounce | Fake timers |
| Landing page | SSG |
| Chi tiết sản phẩm cần SEO, đổi định kỳ | ISR |
| Giỏ hàng / kết quả tìm kiếm | SSR (hoặc CSR) |
| Dashboard sau đăng nhập | CSR |
| Admin vừa sửa sản phẩm, cần cập nhật ngay | `revalidatePath` |
| Dùng useState/onClick trong Next.js | `'use client'` |
| Chặn sớm trang riêng tư | Middleware + matcher |
| Xoá sản phẩm chỉ admin | Kiểm tra `auth()` + role trong Server Action + zod |
| Nhiều URL cùng nội dung | canonical |
| Trang riêng tư không cho index | `robots: { index: false }` |

## NHỮNG "BẪY" HAY RA TRONG ĐỀ

1. `useMemo` **không** ngăn component render lại.
2. `React.memo` vô tác dụng nếu prop là hàm/object tạo mới mỗi lần render.
3. `arePropsEqual` trả **true** = KHÔNG render lại.
4. `React.lazy` không hỗ trợ SSR → `@loadable/component`.
5. `configureStore` tự thêm **redux-thunk** và bật **DevTools**.
6. `createAsyncThunk` sinh **pending / fulfilled / rejected**; Zustand async **không** tự có.
7. Zustand `set()` **merge nông**, không cần Provider.
8. Context: mọi consumer re-render khi value đổi → tách Context + `useMemo` value.
9. `getBy` ném lỗi ngay; `queryBy` trả null; `findBy` trả Promise.
10. `getByTestId` là lựa chọn **cuối cùng**; `getByRole` ưu tiên nhất.
11. Coverage 100% ≠ không còn lỗi.
12. Next.js 15: `fetch` mặc định **không cache**; `params` là Promise.
13. ISR: người đầu tiên sau khi hết hạn **vẫn nhận bản cũ**.
14. `[...slug]` không khớp `/docs`; `[[...slug]]` thì khớp.
15. `(group)` không xuất hiện trong URL; `_folder` không thành route.
16. `layout` không mount lại; `template` mount lại.
17. `useRouter/usePathname` chỉ ở Client Component; server dùng `redirect/notFound`.
18. Store Redux trong Next.js: không singleton, `makeStore()` mỗi request.
19. Middleware chạy Edge Runtime: không bcrypt, không DB; chỉ là lớp chặn **sớm**, không phải lớp duy nhất.
20. Credentials provider **bắt buộc** session strategy `jwt`.
21. 401 = chưa đăng nhập; 403 = thiếu quyền.
22. Biến môi trường có `NEXT_PUBLIC_` sẽ lộ ra client.
23. `redirect` đổi URL; `rewrite` giữ nguyên URL.
24. Đo Lighthouse trên bản production, không trên `npm run dev`.
25. Decorator cần `"experimentalDecorators": true`.
