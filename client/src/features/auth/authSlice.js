import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "authen",
  initialState: {
    token: null,
  },
  reducers: {
    getAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logout: (state, action) => {
      state.token = null;
    },
  },
});

export const { getAccessToken, logout } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;

export default authSlice.reducer;
