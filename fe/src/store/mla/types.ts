import type { CitizenGrievance } from '../citizenSlice';

export interface MlaKpis {
  total: number;
  resolved: number;
  pending: number;
  visited: number;
  acknowledged: number;
  enroute: number;
  resolutionRate: number;
  avgResolutionDays: number;
}

export interface MlaCategoryKpi {
  category: string;
  count: number;
}

export interface MlaVillagePerformance {
  villageName: string;
  totalIssues: number;
  resolvedIssues: number;
  resolutionRate: number;
}

export interface MlaMandalPerformance {
  mandalId: string;
  mandalName: string;
  metrics: {
    totalGrievances: number;
    resolvedGrievances: number;
    pendingGrievances: number;
    inProgressGrievances: number;
    resolutionRate: number;
    avgResolutionDays: number;
  };
  status: {
    performanceLevel: 'EXCELLENT' | 'STABLE' | 'NEEDS_ATTENTION' | string;
    colorCode: string;
  };
}

export interface MlaAnalytics {
  citizenSatisfactionScore: number;
  rateImprovementPercentage: number;
  resolutionRate: number;
  monthlyTrend: {
    month: string;
    raised: number;
    resolved: number;
  }[];
}

export interface MlaState {
  kpis: MlaKpis | null;
  categoryKpis: MlaCategoryKpi[] | null;
  villagePerformance: MlaVillagePerformance[] | null;
  mandalPerformance: MlaMandalPerformance[] | null;
  analytics: MlaAnalytics | null;
  constituencyGrievances: CitizenGrievance[];
  loading: boolean;
  error: string | null;
}
