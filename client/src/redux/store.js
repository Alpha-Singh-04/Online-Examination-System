import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

const rootReducer = {
  // user: (state = { name: 'John Doe', loggedIn: false }, action) => {
  //   switch (action.type) {
  //     case 'LOGIN':
  //       return { ...state, loggedIn: true };
  //     case 'LOGOUT':
  //       return { ...state, loggedIn: false };
  //     default:
  //       return state;
  //   }
  // },
  // exam: (state = { questions: [], currentQuestion: 0 }, action) => {
  //   switch (action.type) {
  //     case 'SET_QUESTIONS':
  //       return { ...state, questions: action.payload };
  //     case 'NEXT_QUESTION':
  //       return { ...state, currentQuestion: state.currentQuestion + 1 };
  //     case 'PREVIOUS_QUESTION':
  //       return { ...state, currentQuestion: state.currentQuestion - 1 };
  //     default:
  //       return state;
  //   }
  // }

  auth: authReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});