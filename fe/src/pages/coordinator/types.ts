export interface Issue {
  id: string;
  category: string;
  rawTitle: string; // Title||Description||Urgency
  village: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  reporter: string;
  phone: string;
  date: string;
}

export interface FieldOfficer {
  id: string;
  name: string;
  designation: string;
  village: string;
  status: 'Available' | 'Busy' | 'Overloaded';
  activeTasks: number;
  resolvedTasks: number;
  avgCloseTime: string;
  tasksList: string[];
}
