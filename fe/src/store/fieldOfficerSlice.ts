import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';

export interface FieldOfficerAssignment {
  id: string;
  grievanceId?: string;
  stopNum: number;
  citizenName: string;
  phone: string;
  address: string;
  category: string;
  title: string;
  description: string;
  village: string;
  ward: string;
  urgency: 'Low' | 'Medium' | 'High' | string;
  status: 'Pending' | 'EnRoute' | 'Visited' | 'Resolved' | 'Escalated' | string;
  time: string;
  distance: string;
  notes?: string;
  photoUploaded?: boolean;
  checkedInAt?: string;
  attachments?: string[];
}

export interface FieldOfficerStats {
  totalAssigned: number;
  resolvedCount: number;
  visitedCount: number;
  pendingCount: number;
  completionRate: number;
  avgResolutionDays: number;
  satisfactionRating: number;
}

interface FieldOfficerState {
  assignments: FieldOfficerAssignment[];
  selectedAssignment: FieldOfficerAssignment | null;
  stats: FieldOfficerStats | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  toastMessage: string | null;
}

const fallbackAssignments: FieldOfficerAssignment[] = [
  {
    id: '1',
    stopNum: 1,
    citizenName: 'Ravi Kumar',
    phone: '+91 98765 43210',
    address: 'D.No 3-14, Ward 3, Kuppam Town',
    category: 'Road / Infra',
    title: 'Road collapse blocks path',
    description: 'Large potholes and road collapse near government school entrance.',
    village: 'Kuppam Town',
    ward: 'Ward 3',
    urgency: 'Medium',
    status: 'Resolved',
    time: 'Visited 9:20 AM',
    distance: '0.0 km',
    notes: 'Road requires immediate gravel fill. MLA office notified.',
    photoUploaded: true,
  },
  {
    id: '2',
    stopNum: 2,
    citizenName: 'Lakshmi Devi',
    phone: '+91 98765 43211',
    address: 'D.No 4-23, Ward 4, Kuppam Town',
    category: 'Water supply',
    title: 'No water for 5 days',
    description: 'No water supply in the entire locality for 5 consecutive days.',
    village: 'Kuppam Town',
    ward: 'Ward 4',
    urgency: 'High',
    status: 'EnRoute',
    time: 'En route',
    distance: '0.8 km',
  },
  {
    id: '3',
    stopNum: 3,
    citizenName: 'Suresh Babu',
    phone: '+91 98765 43212',
    address: 'D.No 4-56, Ward 4, Kuppam Town',
    category: 'Health',
    title: 'PHC doctor absent',
    description: 'Elderly patient critical and needs assistance. PHC doctor absent.',
    village: 'Kuppam Town',
    ward: 'Ward 4',
    urgency: 'High',
    status: 'Pending',
    time: 'Next stop',
    distance: '1.2 km',
  },
  {
    id: '4',
    stopNum: 4,
    citizenName: 'Anita Reddy',
    phone: '+91 98765 43215',
    address: 'D.No 5-12, Venkatapur',
    category: 'Health',
    title: 'PHC doctor absent — elderly patient critical',
    description: 'PHC doctor has been absent for the past 2 weeks. Elderly patient with diabetes needs urgent attention.',
    village: 'Venkatapur village',
    ward: 'Ward 5',
    urgency: 'High',
    status: 'Pending',
    time: '6 days ago',
    distance: '2.1 km',
  },
  {
    id: '5',
    stopNum: 5,
    citizenName: 'Krishnamurthy',
    phone: '+91 98765 43220',
    address: 'Ramagiri, Ward 2',
    category: 'Road / Infra',
    title: 'Road collapse blocks ambulance route',
    description: 'Main road to hospital has collapsed blocking transit.',
    village: 'Ramagiri village',
    ward: 'Ward 2',
    urgency: 'High',
    status: 'Pending',
    time: '4 days ago',
    distance: '2.8 km',
  },
  {
    id: '6',
    stopNum: 6,
    citizenName: 'Padma Rao',
    phone: '+91 98765 43221',
    address: 'Bethampudi, Ward 6',
    category: 'Education',
    title: 'Mid-day meal delayed 3 days',
    description: 'Government school mid-day meal delayed.',
    village: 'Bethampudi village',
    ward: 'Ward 6',
    urgency: 'Medium',
    status: 'Pending',
    time: '3 days ago',
    distance: '3.4 km',
  },
  {
    id: '7',
    stopNum: 7,
    citizenName: 'Srinivas Rao',
    phone: '+91 98765 43222',
    address: 'Kuppam Town, Ward 1',
    category: 'Civic',
    title: 'Panchayat office gate lock broken',
    description: 'Gate lock is broken and security is compromised.',
    village: 'Kuppam Town',
    ward: 'Ward 1',
    urgency: 'Low',
    status: 'Pending',
    time: '1 day ago',
    distance: '4.1 km',
  },
  {
    id: '8',
    stopNum: 8,
    citizenName: 'Meena Kumari',
    phone: '+91 98765 43223',
    address: 'Nattrampallee, Ward 6',
    category: 'Environment',
    title: 'Fallen tree branch blocking footpath',
    description: 'Large branch blocked pedestrian pathway.',
    village: 'Nattrampallee',
    ward: 'Ward 6',
    urgency: 'Low',
    status: 'Pending',
    time: '1 day ago',
    distance: '5.2 km',
  },
];

const initialState: FieldOfficerState = {
  assignments: fallbackAssignments,
  selectedAssignment: null,
  stats: {
    totalAssigned: 8,
    resolvedCount: 5,
    visitedCount: 6,
    pendingCount: 2,
    completionRate: 92.5,
    avgResolutionDays: 2.1,
    satisfactionRating: 4.8,
  },
  loading: false,
  updating: false,
  error: null,
  toastMessage: null,
};

export const fetchFOAssignments = createAsyncThunk(
  'fieldOfficer/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<FieldOfficerAssignment[]>('/api/field-officer/assignments');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch assignments');
    }
  }
);

export const fetchFOAssignmentDetail = createAsyncThunk(
  'fieldOfficer/fetchAssignmentDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiService.get<FieldOfficerAssignment>(`/api/field-officer/assignments/${id}`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch assignment detail');
    }
  }
);

export const fetchFOStats = createAsyncThunk(
  'fieldOfficer/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get<FieldOfficerStats>('/api/field-officer/stats');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch field officer stats');
    }
  }
);

export const checkInFOAssignment = createAsyncThunk(
  'fieldOfficer/checkIn',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiService.post<FieldOfficerAssignment>(`/api/field-officer/assignments/${id}/checkin`, {});
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to check in');
    }
  }
);

export const updateFOAssignmentStatus = createAsyncThunk(
  'fieldOfficer/updateStatus',
  async (
    payload: { id: string; status: string; fieldNotes?: string; photoStorageUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      return await apiService.put<FieldOfficerAssignment>(`/api/field-officer/assignments/${payload.id}/status`, {
        status: payload.status,
        fieldNotes: payload.fieldNotes,
        photoStorageUrl: payload.photoStorageUrl,
      });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update assignment status');
    }
  }
);

export const escalateFOAssignment = createAsyncThunk(
  'fieldOfficer/escalate',
  async (payload: { id: string; reason: string; notes?: string }, { rejectWithValue }) => {
    try {
      return await apiService.post<FieldOfficerAssignment>(`/api/field-officer/assignments/${payload.id}/escalate`, {
        reason: payload.reason,
        notes: payload.notes,
      });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to escalate assignment');
    }
  }
);

const fieldOfficerSlice = createSlice({
  name: 'fieldOfficer',
  initialState,
  reducers: {
    setSelectedAssignment: (state, action: PayloadAction<FieldOfficerAssignment | null>) => {
      state.selectedAssignment = action.payload;
    },
    setFOToast: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
    clearFOError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Assignments
    builder
      .addCase(fetchFOAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFOAssignments.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.assignments = action.payload;
        }
      })
      .addCase(fetchFOAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assignment Detail
    builder
      .addCase(fetchFOAssignmentDetail.fulfilled, (state, action) => {
        state.selectedAssignment = action.payload;
      });

    // FO Stats
    builder
      .addCase(fetchFOStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    // Check In
    builder
      .addCase(checkInFOAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment && state.selectedAssignment.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
      });

    // Update Status
    builder
      .addCase(updateFOAssignmentStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateFOAssignmentStatus.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment && state.selectedAssignment.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
        if (state.stats && action.payload.status === 'Resolved') {
          state.stats.resolvedCount += 1;
          state.stats.pendingCount = Math.max(0, state.stats.pendingCount - 1);
        }
      })
      .addCase(updateFOAssignmentStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Escalate
    builder
      .addCase(escalateFOAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment && state.selectedAssignment.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
      });
  },
});

export const { setSelectedAssignment, setFOToast, clearFOError } = fieldOfficerSlice.actions;
export default fieldOfficerSlice.reducer;
