import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Language } from '../i18n/translations';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface UiState {
  notifications: AppNotification[];
  showNotifications: boolean;
  newIssueModalOpen: boolean;
  language: Language;
}

const initialState: UiState = {
  notifications: [
    {
      id: 'n1',
      title: 'Water Complaint',
      description: 'Lakshmi Devi raised a water supply issue in Ramagiri.',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: 'n2',
      title: 'Road Works Escalated',
      description: 'Ravi Kumar reported critical potholes in Kuppam.',
      time: '3 hours ago',
      isRead: false,
    },
    {
      id: 'n3',
      title: 'System Resolution',
      description: 'Streetlight outage resolved automatically in Gudupalli.',
      time: '1 day ago',
      isRead: true,
    },
  ],
  showNotifications: false,
  newIssueModalOpen: false,
  language: (localStorage.getItem('appLanguage') as Language) || 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNotifications: (state) => {
      state.showNotifications = !state.showNotifications;
    },
    closeNotifications: (state) => {
      state.showNotifications = false;
    },
    addNotification: (state, action: PayloadAction<Omit<AppNotification, 'id' | 'time' | 'isRead'>>) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        time: 'Just now',
        isRead: false,
      });
    },
    markNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },
    setNewIssueModalOpen: (state, action: PayloadAction<boolean>) => {
      state.newIssueModalOpen = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem('appLanguage', action.payload);
    },
  },
});

export const {
  toggleNotifications,
  closeNotifications,
  addNotification,
  markNotificationsRead,
  setNewIssueModalOpen,
  setLanguage,
} = uiSlice.actions;
export default uiSlice.reducer;
