import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import type {
  MlaKpis,
  MlaCategoryKpi,
  MlaVillagePerformance,
  MlaMandalPerformance,
  MlaAnalytics,
} from './types';
import type { CitizenGrievance } from '../citizenSlice';

export const fetchMlaKpis = createAsyncThunk<MlaKpis, void, { rejectValue: string }>(
  'mla/fetchKpis',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<MlaKpis>('/api/mla/kpis');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA KPIs');
    }
  }
);

export const fetchMlaCategoryKpis = createAsyncThunk<MlaCategoryKpi[], void, { rejectValue: string }>(
  'mla/fetchCategoryKpis',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<MlaCategoryKpi[]>('/api/mla/kpis/category');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Category KPIs');
    }
  }
);

export const fetchMlaVillagePerformance = createAsyncThunk<MlaVillagePerformance[], void, { rejectValue: string }>(
  'mla/fetchVillagePerformance',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<MlaVillagePerformance[]>('/api/mla/kpis/village');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Village Performance');
    }
  }
);

export const fetchMlaMandalPerformance = createAsyncThunk<MlaMandalPerformance[], void, { rejectValue: string }>(
  'mla/fetchMandalPerformance',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<MlaMandalPerformance[]>('/api/mla/kpis/mandal');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Mandal Performance');
    }
  }
);

export const fetchMlaAnalytics = createAsyncThunk<MlaAnalytics, void, { rejectValue: string }>(
  'mla/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<MlaAnalytics>('/api/mla/analytics');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch MLA Analytics');
    }
  }
);

export const fetchConstituencyGrievances = createAsyncThunk<
  CitizenGrievance[],
  { village?: string; status?: string; category?: string } | undefined,
  { rejectValue: string }
>(
  'mla/fetchConstituencyGrievances',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qp = new URLSearchParams();
      if (params.village) qp.set('village', params.village);
      if (params.status) qp.set('status', params.status);
      if (params.category) qp.set('category', params.category);
      const qs = qp.toString();
      return await apiService.get<CitizenGrievance[]>(`/api/mla/grievances${qs ? `?${qs}` : ''}`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch constituency grievances');
    }
  }
);

export const resolveMlaGrievance = createAsyncThunk<
  CitizenGrievance,
  { grievanceId: string; resolutionNote: string },
  { rejectValue: string }
>(
  'mla/resolveGrievance',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiService.post<CitizenGrievance>(`/api/mla/grievances/${payload.grievanceId}/resolve`, {
        resolutionNote: payload.resolutionNote,
      });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to resolve grievance');
    }
  }
);

export const addMlaComment = createAsyncThunk<
  CitizenGrievance,
  { grievanceId: string; comment: string },
  { rejectValue: string }
>(
  'mla/addComment',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiService.post<CitizenGrievance>(`/api/mla/grievances/${payload.grievanceId}/comments`, {
        comment: payload.comment,
      });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add comment');
    }
  }
);
