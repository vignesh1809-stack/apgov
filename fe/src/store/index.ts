import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import issuesReducer from './issuesSlice';
import uiReducer from './uiSlice';
import mlaReducer from './mla';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    ui: uiReducer,
    mla: mlaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
