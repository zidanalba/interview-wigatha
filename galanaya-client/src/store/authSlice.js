import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  roles: [],
  permissions: [],
  is_active: null, // tambahkan di sini
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, access_token, roles, permissions, is_active } = action.payload;
      state.user = user;
      state.token = access_token;
      state.roles = roles;
      state.permissions = permissions;
      state.is_active = is_active; // tambahkan di sini

      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.permissions = [];
      state.is_active = null;

      localStorage.removeItem("auth");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
