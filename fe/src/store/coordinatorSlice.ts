import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';
import type { CitizenGrievance } from './citizenSlice';

export interface CoordinatorKpis {
  unassignedCount: number;
  activeFoCount: number;
  inProgressCount: number;
  resolvedCount: number;
  urgentUnassignedCount: number;
}

export interface FieldOfficerWorkload {
  id: string;
  name: string;
  designation: string;
  village: string;
  phone?: string;
  status: 'Available' | 'Busy' | 'Overloaded' | string;
  activeTasks: number;
  resolvedTasks: number;
  avgCloseTime: string;
  tasksList: string[];
}

export interface CoordinatorReport {
  mandalName: string;
  totalGrievances: number;
  resolvedGrievances: number;
  pendingGrievances: number;
  resolutionRate: number;
  categoryBreakdown: { category: string; count: number }[];
  villageBreakdown: { villageName: string; totalIssues: number; resolvedIssues: number; resolutionRate: number }[];
}

interface CoordinatorState {
  kpis: CoordinatorKpis | null;
  grievances: CitizenGrievance[];
  fieldOfficers: FieldOfficerWorkload[];
  reports: CoordinatorReport | null;
  selectedGrievance: CitizenGrievance | null;
  loading: boolean;
  assigning: boolean;
  error: string | null;
  toastMessage: string | null;
}

const fallbackFieldOfficers: FieldOfficerWorkload[] = [
  {
    id: 'FO-KUP-042',
    name: 'Suresh Reddy',
    designation: 'Ward 1–6 · Kuppam Town',
    village: 'Kuppam Town · Ward 4',
    status: 'Available',
    activeTasks: 2,
    resolvedTasks: 5,
    avgCloseTime: '2.1d',
    tasksList: ['Water pipeline leakage main junction', 'Repair of streetlights in Ward 2'],
  },
  {
    id: 'FO-KUP-038',
    name: 'Praveen Murthy',
    designation: 'Ward 1–4 · Kuppam Town',
    village: 'Kuppam Town · Ward 1',
    status: 'Available',
    activeTasks: 4,
    resolvedTasks: 8,
    avgCloseTime: '2.8d',
    tasksList: ['Drainage repair', 'Pothole filling Ward 3', 'Water pipeline check', 'Panchayat cleaning'],
  },
  {
    id: 'FO-KUP-041',
    name: 'Venu Kumar',
    designation: 'Ward 3–6 · Kuppam Town',
    village: 'Kuppam Town · Ward 3',
    status: 'Busy',
    activeTasks: 7,
    resolvedTasks: 12,
    avgCloseTime: '3.2d',
    tasksList: ['School building inspection', 'Substation oil change', 'Drainage overflow main street', 'Road leveling', 'Borewell pump repair', 'Public toilet maintenance', 'Park gate repair'],
  },
  {
    id: 'FO-KUP-040',
    name: 'Govind Rao',
    designation: 'Ward 2–5 · Kuppam Town',
    village: 'Gudupalli village · Ward 3',
    status: 'Busy',
    activeTasks: 6,
    resolvedTasks: 9,
    avgCloseTime: '2.5d',
    tasksList: ['Gudupalli PHC cleaning', 'Transformer fencing', 'High voltage line clearance', 'Panchayat board replacement', 'Streetlights Gudupalli', 'Drainage cleaning Ward 2'],
  },
  {
    id: 'FO-KUP-043',
    name: 'Naresh Kumar',
    designation: 'Ward 4–6 · Kuppam Town',
    village: 'Venkatapur village · Ward 5',
    status: 'Busy',
    activeTasks: 5,
    resolvedTasks: 7,
    avgCloseTime: '2.9d',
    tasksList: ['Venkatapur road repair', 'School drinking water supply', 'PHC doctor attendance register', 'Anganwadi food check', 'Pond desilting'],
  },
  {
    id: 'FO-KUP-039',
    name: 'Ravi Prasad',
    designation: 'Ward 1–6 · Kuppam Town',
    village: 'Ramagiri village · Ward 2',
    status: 'Overloaded',
    activeTasks: 10,
    resolvedTasks: 15,
    avgCloseTime: '3.5d',
    tasksList: ['Ramagiri road block', 'Bridge repair work', 'Drinking water chlorination', 'Streetlight complaints Ward 1', 'Sanitation drive Ramagiri', 'Weed clearing primary school', 'Veterinary clinic water supply', 'High school roof repair', 'Gravel laying Ward 6', 'Community hall electrical check'],
  },
];

const initialState: CoordinatorState = {
  kpis: {
    unassignedCount: 8,
    activeFoCount: 6,
    inProgressCount: 4,
    resolvedCount: 15,
    urgentUnassignedCount: 4,
  },
  grievances: [],
  fieldOfficers: fallbackFieldOfficers,
  reports: null,
  selectedGrievance: null,
  loading: false,
  assigning: false,
  error: null,
  toastMessage: null,
};

export const fetchCoordinatorKpis = createAsyncThunk(
  'coordinator/fetchKpis',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<CoordinatorKpis>('/api/coordinator/kpis');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch coordinator KPIs');
    }
  }
);

export const fetchCoordinatorGrievances = createAsyncThunk<
  CitizenGrievance[],
  { status?: string; urgency?: string; villageId?: string; search?: string } | undefined,
  { rejectValue: string }
>(
  'coordinator/fetchGrievances',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.set('status', params.status);
      if (params.urgency) queryParams.set('urgency', params.urgency);
      if (params.villageId) queryParams.set('villageId', params.villageId);
      if (params.search) queryParams.set('search', params.search);

      const qs = queryParams.toString();
      const url = `/api/coordinator/grievances${qs ? `?${qs}` : ''}`;
      return await apiService.get<CitizenGrievance[]>(url);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch coordinator grievances');
    }
  }
);

export const fetchCoordinatorGrievanceDetail = createAsyncThunk(
  'coordinator/fetchGrievanceDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiService.get<CitizenGrievance>(`/api/coordinator/grievances/${id}`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch grievance detail');
    }
  }
);

export const fetchCoordinatorFieldOfficers = createAsyncThunk(
  'coordinator/fetchFieldOfficers',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<FieldOfficerWorkload[]>('/api/coordinator/field-officers');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch field officers');
    }
  }
);

export const assignGrievanceToFO = createAsyncThunk(
  'coordinator/assignGrievance',
  async (
    payload: {
      grievanceId: string;
      fieldOfficerId: string;
      stopSequence?: number;
      assignmentDate?: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await apiService.post<CitizenGrievance>('/api/coordinator/assignments', payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to assign grievance');
    }
  }
);

export const fetchCoordinatorReports = createAsyncThunk(
  'coordinator/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<CoordinatorReport>('/api/coordinator/reports');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch reports');
    }
  }
);

const coordinatorSlice = createSlice({
  name: 'coordinator',
  initialState,
  reducers: {
    setSelectedCoordinatorGrievance: (state, action: PayloadAction<CitizenGrievance | null>) => {
      state.selectedGrievance = action.payload;
    },
    setCoordinatorToast: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
    clearCoordinatorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // KPIs
    builder
      .addCase(fetchCoordinatorKpis.fulfilled, (state, action) => {
        state.kpis = action.payload;
      });

    // Grievances
    builder
      .addCase(fetchCoordinatorGrievances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoordinatorGrievances.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.grievances = action.payload;
        }
      })
      .addCase(fetchCoordinatorGrievances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Grievance Detail
    builder
      .addCase(fetchCoordinatorGrievanceDetail.fulfilled, (state, action) => {
        state.selectedGrievance = action.payload;
      });

    // Field Officers
    builder
      .addCase(fetchCoordinatorFieldOfficers.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.fieldOfficers = action.payload;
        }
      });

    // Assign Grievance
    builder
      .addCase(assignGrievanceToFO.pending, (state) => {
        state.assigning = true;
      })
      .addCase(assignGrievanceToFO.fulfilled, (state, action) => {
        state.assigning = false;
        const index = state.grievances.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.grievances[index] = action.payload;
        }
        if (state.selectedGrievance && state.selectedGrievance.id === action.payload.id) {
          state.selectedGrievance = action.payload;
        }
        if (state.kpis) {
          state.kpis.unassignedCount = Math.max(0, state.kpis.unassignedCount - 1);
          state.kpis.inProgressCount += 1;
        }
      })
      .addCase(assignGrievanceToFO.rejected, (state, action) => {
        state.assigning = false;
        state.error = action.payload as string;
      });

    // Reports
    builder
      .addCase(fetchCoordinatorReports.fulfilled, (state, action) => {
        state.reports = action.payload;
      });
  },
});

export const {
  setSelectedCoordinatorGrievance,
  setCoordinatorToast,
  clearCoordinatorError,
} = coordinatorSlice.actions;

export default coordinatorSlice.reducer;
