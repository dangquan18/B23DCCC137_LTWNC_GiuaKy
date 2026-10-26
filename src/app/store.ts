import { configureStore } from '@reduxjs/toolkit';
import { borrowLimitMiddleware } from '../features/books/borrowLimitMiddleware';
import { rootReducer, type RootState } from './rootReducer';

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(borrowLimitMiddleware),
  });
}

export const store = setupStore();

export type { RootState };
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
