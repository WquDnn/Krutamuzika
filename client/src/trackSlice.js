import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Екшен для завантаження треків (вже створений раніше)
export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (SERVER_URL, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/tracks`);
      if (!response.ok) throw new Error('Не вдалося завантажити треки');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// НОВИЙ ЕКШЕН: Додавання треку
export const addTrack = createAsyncThunk(
  'tracks/addTrack',
  async ({ formData, SERVER_URL }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/add`, {
        method: 'POST',
        body: formData, // Передаємо наш FormData
      });

      if (!response.ok) throw new Error('Помилка при додаванні треку');
      const data = await response.json();

      if (data?.status === 'ok') {
        // 🔥 Ключовий момент: після успішного додавання запускаємо оновлення списку!
        dispatch(fetchTracks(SERVER_URL));
        return data;
      } else {
        throw new Error(data?.message || 'Щось пішло не так');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tracksSlice = createSlice({
  name: 'tracks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    isSubmitting: false, // Окремий стан для блокування кнопки під час завантаження файлів
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Завантаження треків
      .addCase(fetchTracks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTracks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTracks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Додавання треку
      .addCase(addTrack.pending, (state) => { state.isSubmitting = true; })
      .addCase(addTrack.fulfilled, (state) => { state.isSubmitting = false; })
      .addCase(addTrack.rejected, (state, action) => { 
        state.isSubmitting = false; 
        alert(`Помилка: ${action.payload}`); // Або виведи в інтерфейс модалки
      });
  },
});

export default tracksSlice.reducer;