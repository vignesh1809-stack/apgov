import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MlaState, MlaKpis, MlaCategoryKpi, MlaVillagePerformance, MlaMandalPerformance, MlaAnalytics } from './types';
import {
  fetchMlaKpis,
  fetchMlaCategoryKpis,
  fetchMlaVillagePerformance,
  fetchMlaMandalPerformance,
  fetchMlaAnalytics,
  fetchConstituencyGrievances,
  resolveMlaGrievance,
  addMlaComment,
} from './actions';

const initialState: MlaState = {
  kpis: null,
  categoryKpis: null,
  villagePerformance: null,
  mandalPerformance: null,
  analytics: null,
  constituencyGrievances: [],
  loading: false,
  error: null,
};

const mlaSlice = createSlice({
  name: 'mla',
  initialState,
  reducers: {
    clearMlaKpis: (state) => {
      state.kpis = null;
      state.categoryKpis = null;
      state.villagePerformance = null;
      state.mandalPerformance = null;
      state.analytics = null;
      state.constituencyGrievances = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch KPIs
      .addCase(fetchMlaKpis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMlaKpis.fulfilled, (state, action: PayloadAction<MlaKpis>) => {
        state.loading = false;
        state.kpis = action.payload;
        state.error = null;
      })
      .addCase(fetchMlaKpis.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      })
      // Fetch Category KPIs
      .addCase(fetchMlaCategoryKpis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMlaCategoryKpis.fulfilled, (state, action: PayloadAction<MlaCategoryKpi[]>) => {
        state.loading = false;
        state.categoryKpis = action.payload;
        state.error = null;
      })
      .addCase(fetchMlaCategoryKpis.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      })
      // Fetch Village Performance
      .addCase(fetchMlaVillagePerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMlaVillagePerformance.fulfilled, (state, action: PayloadAction<MlaVillagePerformance[]>) => {
        state.loading = false;
        state.villagePerformance = action.payload;
        state.error = null;
      })
      .addCase(fetchMlaVillagePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      })
      // Fetch Mandal Performance
      .addCase(fetchMlaMandalPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMlaMandalPerformance.fulfilled, (state, action: PayloadAction<MlaMandalPerformance[]>) => {
        state.loading = false;
        state.mandalPerformance = action.payload;
        state.error = null;
      })
      .addCase(fetchMlaMandalPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      })
      // Fetch Analytics
      .addCase(fetchMlaAnalytics.fulfilled, (state, action: PayloadAction<MlaAnalytics>) => {
        state.analytics = action.payload;
      })
      // Fetch Constituency Grievances
      .addCase(fetchConstituencyGrievances.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.constituencyGrievances = action.payload;
        }
      })
      // Resolve Grievance
      .addCase(resolveMlaGrievance.fulfilled, (state, action) => {
        const index = state.constituencyGrievances.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.constituencyGrievances[index] = action.payload;
        }
        if (state.kpis) {
          state.kpis.resolved += 1;
          state.kpis.pending = Math.max(0, state.kpis.pending - 1);
        }
      })
      // Add Comment
      .addCase(addMlaComment.fulfilled, (state, action) => {
        const index = state.constituencyGrievances.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.constituencyGrievances[index] = action.payload;
        }
      });
  },
});

export const { clearMlaKpis } = mlaSlice.actions;
export default mlaSlice.reducer;
