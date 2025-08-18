"use client"

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Counterslice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});