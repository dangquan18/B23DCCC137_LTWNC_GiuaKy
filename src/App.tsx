import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import Header from './components/Header';
import BooksPage from './features/books/BooksPage';
import BorrowedDock from './features/books/BorrowedDock';
import { fetchBooks } from './features/books/booksSlice';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const shouldFail = new URLSearchParams(window.location.search).has('fail');
    void dispatch(fetchBooks({ shouldFail }));
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Suspense fallback={<p className="status">Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BorrowedDock />
    </div>
  );
}
