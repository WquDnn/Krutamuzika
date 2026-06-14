import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from './trackSlice';
import { createLogger } from 'redux-logger'; // Change this import

const logger = createLogger(); 

export const store = configureStore({
  reducer: {
    tracks: tracksReducer,
  },
  // Using the standard parameter name makes it cleaner and easier to maintain
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});