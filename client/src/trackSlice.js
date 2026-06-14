import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Асинхронний екшен для завантаження треків з сервера
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

// 2. Асинхронний екшен для додавання нового треку (POST FormData)
export const addTrack = createAsyncThunk(
  'tracks/addTrack',
  async ({ formData, SERVER_URL }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/add`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Помилка при додаванні треку');
      const data = await response.json();

      if (data?.status === 'ok') {
        // Одразу оновлюємо список треків у сторі після успішного додавання
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

// 3. Створення слайсу з початковим станом та реड्यूсерами
const tracksSlice = createSlice({
  name: 'tracks',
  initialState: {
    items: [],            // Список усіх треків
    loading: false,       // Стан завантаження списку
    error: null,          // Помилка завантаження списку
    isSubmitting: false,  // Стан відправки форми (для лоадера в модалці)
    
    // Стан плеєра
    currentTrack: null,   // Об'єкт треку, який зараз вибрано
    isPlaying: false,     // Прапорець: грає трек (true) чи стоїть на паузі (false)
  },
  reducers: {
    // Екшен для зміни поточного треку (викликається при кліку в TrackList)
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.isPlaying = true; // При виборі нового треку автоматично вмикаємо відтворення
    },
    // Екшен для керування кнопкою Play/Pause
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обробка завантаження треків (fetchTracks)
      .addCase(fetchTracks.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchTracks.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = action.payload; 
      })
      .addCase(fetchTracks.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // Обробка додавання треку (addTrack)
      .addCase(addTrack.pending, (state) => { 
        state.isSubmitting = true; 
      })
      .addCase(addTrack.fulfilled, (state) => { 
        state.isSubmitting = false; 
      })
      .addCase(addTrack.rejected, (state, action) => { 
        state.isSubmitting = false; 
        alert(`Помилка: ${action.payload}`); 
      });
  },
});

// Експортуємо синхронні екшени для плеєра
export const { setCurrentTrack, setIsPlaying } = tracksSlice.actions;

// Експортуємо дефолтний реड्यूсер для підключення в store.js
export default tracksSlice.reducer;