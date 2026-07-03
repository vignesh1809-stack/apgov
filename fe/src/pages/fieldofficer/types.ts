export interface Assignment {
  id: string;
  stopNum: number;
  citizenName: string;
  phone: string;
  address: string;
  category: string;
  title: string;
  description: string;
  village: string;
  ward: string;
  urgency: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'En route' | 'Visited' | 'Resolved';
  time: string;
  distance: string;
  notes?: string;
  photoUploaded?: boolean;
}
