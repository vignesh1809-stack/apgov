import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import type { MlaKpis, MlaCategoryKpi, MlaVillagePerformance, MlaMandalPerformance } from './types';

export const fetchMlaKpis = createAsyncThunk<
  MlaKpis,
  void,
  { rejectValue: string }
>(
  'mla/fetchKpis',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.get<MlaKpis>('http://localhost:8080/api/mla/kpis');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA KPIs');
    }
  }
);

export const fetchMlaCategoryKpis = createAsyncThunk<
  MlaCategoryKpi[],
  void,
  { rejectValue: string }
>(
  'mla/fetchCategoryKpis',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.get<MlaCategoryKpi[]>('http://localhost:8080/api/mla/kpis/category');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Category KPIs');
    }
  }
);

export const fetchMlaVillagePerformance = createAsyncThunk<
  MlaVillagePerformance[],
  void,
  { rejectValue: string }
>(
  'mla/fetchVillagePerformance',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.get<MlaVillagePerformance[]>('http://localhost:8080/api/mla/kpis/village');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Village Performance');
    }
  }
);

export const fetchMlaMandalPerformance = createAsyncThunk<
  MlaMandalPerformance[],
  void,
  { rejectValue: string }
>(
  'mla/fetchMandalPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.get<MlaMandalPerformance[]>('http://localhost:8080/api/mla/kpis/mandal');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Mandal Performance');
    }
  }
);
