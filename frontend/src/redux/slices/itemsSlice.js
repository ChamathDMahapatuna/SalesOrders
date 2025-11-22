import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiClient';

// Async thunk
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/items');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch items');
    }
  }
);

// Slice
const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
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
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = itemsSlice.actions;
export default itemsSlice.reducer;
