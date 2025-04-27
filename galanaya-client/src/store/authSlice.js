import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  roles: [],
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, access_token, roles, permissions } = action.payload;
      state.user = user;
      state.token = access_token;
      state.roles = roles;
      state.permissions = permissions;

      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.permissions = [];

      localStorage.removeItem("auth");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
