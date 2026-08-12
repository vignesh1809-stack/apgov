import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';

export interface TimelineItem {
  id: string;
  actionStatus: string;
  label: string;
  actorName: string;
  actorRole: string;
  notes?: string;
  timestamp: string;
}

export interface CitizenGrievance {
  id: string;
  referenceCode: string;
  title: string;
  description: string;
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Acknowledged' | 'EnRoute' | 'Visited' | 'Resolved' | 'Escalated' | 'Withdrawn' | string;
  villageId: string;
  villageName: string;
  constituencyName?: string;
  reporterName?: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt?: string;
  image?: string;
  assignedOfficerName?: string;
  resolutionNote?: string;
  timeline?: TimelineItem[];
}

export interface CitizenStats {
  total: number;
  resolved: number;
  pending: number;
  resolutionRate: number;
  myIssuesCount: number;
  villageName: string;
}

export interface VillageOption {
  id: string;
  name: string;
  mandalId?: string;
  mandalName?: string;
  constituencyId?: string;
  constituencyName?: string;
}

interface CitizenState {
  stats: CitizenStats | null;
  grievances: CitizenGrievance[];
  selectedGrievance: CitizenGrievance | null;
  villages: VillageOption[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  appointmentSuccess: boolean;
}

const initialState: CitizenState = {
  stats: {
    total: 300,
    resolved: 278,
    pending: 22,
    resolutionRate: 92.7,
    myIssuesCount: 3,
    villageName: 'Kuppam',
  },
  grievances: [],
  selectedGrievance: null,
  villages: [
    { id: '1', name: 'Kuppam' },
    { id: '2', name: 'Ramagiri' },
    { id: '3', name: 'Gudupalli' },
    { id: '4', name: 'Venkatapur' },
    { id: '5', name: 'Bethampudi' },
  ],
  loading: false,
  submitting: false,
  error: null,
  appointmentSuccess: false,
};

export const fetchCitizenStats = createAsyncThunk(
  'citizen/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<CitizenStats>('/api/citizen/stats');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch citizen stats');
    }
  }
);

export const fetchCitizenGrievances = createAsyncThunk(
  'citizen/fetchGrievances',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<CitizenGrievance[]>('/api/citizen/grievances');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch grievances');
    }
  }
);

export const fetchCitizenGrievanceDetail = createAsyncThunk(
  'citizen/fetchGrievanceDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiService.get<CitizenGrievance>(`/api/citizen/grievances/${id}`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch grievance detail');
    }
  }
);

export const createCitizenGrievance = createAsyncThunk(
  'citizen/createGrievance',
  async (
    payload: {
      category: string;
      title: string;
      description?: string;
      villageName?: string;
      villageId?: string;
      urgency?: string;
      image?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await apiService.post<CitizenGrievance>('/api/citizen/grievances', payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create grievance');
    }
  }
);

export const withdrawCitizenGrievance = createAsyncThunk(
  'citizen/withdrawGrievance',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiService.post<CitizenGrievance>(`/api/citizen/grievances/${id}/withdraw`, {});
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to withdraw grievance');
    }
  }
);

export const bookCitizenAppointment = createAsyncThunk(
  'citizen/bookAppointment',
  async (payload: { date: string; purpose: string }, { rejectWithValue }) => {
    try {
      return await apiService.post<{ message: string }>('/api/citizen/appointments', payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to book appointment');
    }
  }
);

export const fetchVillagesList = createAsyncThunk(
  'citizen/fetchVillages',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<VillageOption[]>('/api/citizen/villages');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch villages');
    }
  }
);

const citizenSlice = createSlice({
  name: 'citizen',
  initialState,
  reducers: {
    setSelectedGrievance: (state, action: PayloadAction<CitizenGrievance | null>) => {
      state.selectedGrievance = action.payload;
    },
    clearCitizenError: (state) => {
      state.error = null;
    },
    resetAppointmentStatus: (state) => {
      state.appointmentSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchCitizenStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCitizenStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCitizenStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Grievances List
    builder
      .addCase(fetchCitizenGrievances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCitizenGrievances.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.grievances = action.payload;
        }
      })
      .addCase(fetchCitizenGrievances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Grievance Detail
    builder
      .addCase(fetchCitizenGrievanceDetail.fulfilled, (state, action) => {
        state.selectedGrievance = action.payload;
      });

    // Create Grievance
    builder
      .addCase(createCitizenGrievance.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createCitizenGrievance.fulfilled, (state, action) => {
        state.submitting = false;
        state.grievances.unshift(action.payload);
        if (state.stats) {
          state.stats.total += 1;
          state.stats.pending += 1;
          state.stats.myIssuesCount += 1;
        }
      })
      .addCase(createCitizenGrievance.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // Withdraw Grievance
    builder
      .addCase(withdrawCitizenGrievance.fulfilled, (state, action) => {
        const index = state.grievances.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.grievances[index] = action.payload;
        }
        if (state.selectedGrievance && state.selectedGrievance.id === action.payload.id) {
          state.selectedGrievance = action.payload;
        }
      });

    // Appointment
    builder
      .addCase(bookCitizenAppointment.fulfilled, (state) => {
        state.appointmentSuccess = true;
      });

    // Villages
    builder
      .addCase(fetchVillagesList.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.villages = action.payload;
        }
      });
  },
});

export const { setSelectedGrievance, clearCitizenError, resetAppointmentStatus } = citizenSlice.actions;
export default citizenSlice.reducer;
