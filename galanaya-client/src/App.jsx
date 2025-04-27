import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { colors, CssBaseline, ThemeProvider } from "@mui/material";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users/Users";
import Penjualan from "./pages/Penjualan";
import Pencairan from "./pages/Pencairan";
import Pengembalian from "./pages/Pengembalian";
import Pengeluaran from "./pages/Pengeluaran";
import PembelianBahan from "./pages/PembelianBahan";
import Produksi from "./pages/Produksi";
import Customer from "./pages/Customer";
import Produk from "./pages/Produk";
import JenisPengeluaran from "./pages/JenisPengeluaran";
import BahanBaku from "./pages/BahanBaku";
import UnitBisnis from "./pages/unit-bisnis/UnitBisnis";
import RoleAkses from "./pages/roles/RoleAkses";
import { useDispatch } from "react-redux";
import { setAuth } from "./store/authSlice";
import UsersForm from "./pages/users/UsersForm";
import UnitBisnisForm from "./pages/unit-bisnis/UnitBisnisForm";
import RoleAksesForm from "./pages/roles/RoleAksesForm";

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

          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* users */}
            <Route path="users" element={<Users />} />
            <Route path="/users/add" element={<UsersForm />} />
            <Route path="/users/edit/:id" element={<UsersForm />} />

            <Route path="penjualan" element={<Penjualan />} />
            <Route path="pencairan" element={<Pencairan />} />
            <Route path="pengembalian" element={<Pengembalian />} />
            <Route path="pengeluaran" element={<Pengeluaran />} />
            <Route path="pengeluaran" element={<Pengeluaran />} />
            <Route path="pembelian-bahan" element={<PembelianBahan />} />
            <Route path="produksi" element={<Produksi />} />
            <Route path="customer" element={<Customer />} />
            <Route path="produk" element={<Produk />} />
            <Route path="jenis-pengeluaran" element={<JenisPengeluaran />} />
            <Route path="bahan-baku" element={<BahanBaku />} />
            {/* unit bisnis */}
            <Route path="unit-bisnis" element={<UnitBisnis />} />
            <Route path="unit-bisnis/add" element={<UnitBisnisForm />} />

            {/* roles */}
            <Route path="role-akses" element={<RoleAkses />} />
            <Route path="role-akses/add" element={<RoleAksesForm />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
