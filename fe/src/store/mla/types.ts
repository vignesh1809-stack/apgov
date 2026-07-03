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
    performanceLevel: 'EXCELLENT' | 'STABLE' | 'NEEDS_ATTENTION';
    colorCode: string;
  };
}

export interface MlaState {
  kpis: MlaKpis | null;
  categoryKpis: MlaCategoryKpi[] | null;
  villagePerformance: MlaVillagePerformance[] | null;
  mandalPerformance: MlaMandalPerformance[] | null;
  loading: boolean;
  error: string | null;
}
