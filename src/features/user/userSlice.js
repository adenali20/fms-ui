import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userDetails: null,
  loading: false,
  error: null,

  // 🔹 signup-specific
  signupSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ========================
    // LOGIN
    // ========================
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isLoggedIn = true;
      state.userDetails = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ========================
    // SIGNUP
    // ========================
    signupStart(state) {
      state.loading = true;
      state.error = null;
      state.signupSuccess = false;
    },
    signupSuccess(state) {
      state.loading = false;
      state.signupSuccess = true;
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ========================
    // COMMON
    // ========================
    logout(state) {
      state.isLoggedIn = false;
      state.userDetails = null;
      state.error = null;
      state.signupSuccess = false;
    },
    updateUserDetails(state, action) {
      state.userDetails = {
        ...state.userDetails,
        ...action.payload,
      };
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearSignupState(state) {
      state.signupSuccess = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,

  signupStart,
  signupSuccess,
  signupFailure,

  logout,
  updateUserDetails,
  clearAuthError,
  clearSignupState,
} = userSlice.actions;

export default userSlice.reducer;
