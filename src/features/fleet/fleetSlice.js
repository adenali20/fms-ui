import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fleets: [],
  loading: false,
  error: null,
  endCursor: null,
  hasNextPage: true,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    fetchFleetsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFleetsSuccess(state, action) {
      const { fleets, endCursor, hasNextPage, loadMore } = action.payload;

      state.loading = false;
      state.fleets = loadMore ? [...state.fleets, ...fleets] : fleets;
      state.endCursor = endCursor;
      state.hasNextPage = hasNextPage;
    },
    fetchFleetsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetFleets(state) {
      state.fleets = [];
      state.endCursor = null;
      state.hasNextPage = true;
    },
  },
});

export const {
  fetchFleetsStart,
  fetchFleetsSuccess,
  fetchFleetsFailure,
  resetFleets,
} = fleetSlice.actions;

export default fleetSlice.reducer;
