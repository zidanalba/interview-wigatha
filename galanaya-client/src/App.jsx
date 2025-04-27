import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { colors, CssBaseline, ThemeProvider } from "@mui/material";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Users from "./pages/users/Users";
import RoleAkses from "./pages/roles/RoleAkses";
import UsersForm from "./pages/users/UsersForm";
import RoleAksesForm from "./pages/roles/RoleAksesForm";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  const [theme, colorMode] = useMode();

  useEffect(() => {
    const root = document.documentElement;

    if (theme.palette.mode === "dark") {
      root.style.setProperty("--scrollbar-bg", colors.grey[800]); // dark background
      root.style.setProperty("--scrollbar-thumb", colors.grey[600]); // thumb color
    } else {
      root.style.setProperty("--scrollbar-bg", colors.grey[100]);
      root.style.setProperty("--scrollbar-thumb", colors.grey[400]);
    }
  }, [theme.palette.mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              {/* users */}
              <Route path="users" element={<Users />} />
              <Route path="/users/add" element={<UsersForm />} />
              <Route path="/users/edit/:id" element={<UsersForm />} />

              <Route path="role-akses" element={<RoleAkses />} />
              <Route path="role-akses/add" element={<RoleAksesForm />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
