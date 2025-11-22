import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiClient';

// Async thunk
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/clients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch clients');
    }
  }
);

// Slice
const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;
