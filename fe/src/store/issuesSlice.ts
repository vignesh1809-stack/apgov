import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import resolvedStreetlight from '../assets/resolved_streetlight.png';
import resolvedRoad from '../assets/resolved_road.png';
import resolvedWater from '../assets/resolved_water.png';

export interface Issue {
  id: string;
  title: string;
  category: string;
  village: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  date: string;
  reporter: string;
  image?: string;
}

interface IssuesState {
  list: Issue[];
}

const initialState: IssuesState = {
  list: [
    {
      id: '1',
      title: 'Potholes on main road near school||Large potholes near government school entrance. Causing accidents daily. Children and two-wheelers affected most.||Medium',
      category: 'Road / Infra',
      village: 'Kuppam',
      status: 'Pending',
      date: 'Raised 3 days ago',
      reporter: 'Ravi Kumar',
      image: resolvedRoad,
    },
    {
      id: '2',
      title: 'No water supply for 5 consecutive days||No water supply for 5 consecutive days in the entire locality. Daily chores and drinking water needs are highly affected.||High',
      category: 'Water supply',
      village: 'Kuppam',
      status: 'In Review',
      date: 'Raised 1 day ago',
      reporter: 'Ravi Kumar',
      image: resolvedWater,
    },
    {
      id: '3',
      title: 'Streetlight outage near bus stop||The streetlight near the main bus stop has been non-functional for 8 days. Pedestrians and commuters face safety issues at night. Multiple complaints raised at ward level with no response.||High',
      category: 'Electricity',
      village: 'Kuppam',
      status: 'Resolved',
      date: 'Resolved 2 days ago',
      reporter: 'Ravi Kumar',
      image: resolvedStreetlight,
    },
    {
      id: '4',
      title: 'PHC doctor absent for 2 weeks',
      category: 'Health',
      village: 'Venkatapur',
      status: 'Pending',
      date: 'Raised 6 days ago',
      reporter: 'Suresh Babu',
    },
    {
      id: '5',
      title: 'Mid-day meal supply delayed',
      category: 'Education',
      village: 'Bethampudi',
      status: 'In Review',
      date: 'Raised 4 days ago',
      reporter: 'Anita Reddy',
    },
    {
      id: '6',
      title: 'Pothole repairing on Bypass Road',
      category: 'Road / Infra',
      village: 'Kuppam',
      status: 'Resolved',
      date: 'Resolved 5 days ago',
      reporter: 'Panchayat Board',
      image: resolvedRoad,
    },
    {
      id: '7',
      title: 'Drinking water leak repair at Ramagiri',
      category: 'Water supply',
      village: 'Ramagiri',
      status: 'Resolved',
      date: 'Resolved 6 days ago',
      reporter: 'Water Works Dept',
      image: resolvedWater,
    },
  ],
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    addIssue: (state, action: PayloadAction<Omit<Issue, 'id' | 'date'>>) => {
      const newIssue: Issue = {
        ...action.payload,
        id: Date.now().toString(),
        date: 'Raised Just now',
      };
      state.list.unshift(newIssue);
    },
    updateIssueStatus: (state, action: PayloadAction<{ id: string; status: 'Pending' | 'In Review' | 'Resolved' }>) => {
      const issue = state.list.find((i) => i.id === action.payload.id);
      if (issue) {
        issue.status = action.payload.status;
        if (action.payload.status === 'Resolved') {
          issue.date = 'Resolved Just now';
        } else if (action.payload.status === 'In Review') {
          issue.date = 'Updated to In Review';
        } else {
          issue.date = 'Marked as Pending';
        }
      }
    },
    updateIssueDetails: (state, action: PayloadAction<{ id: string; title: string; category: string }>) => {
      const issue = state.list.find((i) => i.id === action.payload.id);
      if (issue) {
        issue.title = action.payload.title;
        issue.category = action.payload.category;
      }
    },
  },
});

export const { addIssue, updateIssueStatus, updateIssueDetails } = issuesSlice.actions;
export default issuesSlice.reducer;
