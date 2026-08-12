import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import citizenReducer from './citizenSlice';
import coordinatorReducer from './coordinatorSlice';
import fieldOfficerReducer from './fieldOfficerSlice';
import mlaReducer from './mla';
import issuesReducer from './issuesSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    citizen: citizenReducer,
    coordinator: coordinatorReducer,
    fieldOfficer: fieldOfficerReducer,
    mla: mlaReducer,
    issues: issuesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
