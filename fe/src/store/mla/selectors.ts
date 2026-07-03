import type { RootState } from '../index';

export const selectMlaState = (state: RootState) => state.mla;

export const selectMlaKpis = (state: RootState) => state.mla.kpis;
export const selectMlaCategoryKpis = (state: RootState) => state.mla.categoryKpis;
export const selectMlaVillagePerformance = (state: RootState) => state.mla.villagePerformance;
export const selectMlaMandalPerformance = (state: RootState) => state.mla.mandalPerformance;
export const selectMlaLoading = (state: RootState) => state.mla.loading;
export const selectMlaError = (state: RootState) => state.mla.error;
