import React, { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/authSlice";
import api from "../utils/axios";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      // 3. Sukses login → arahkan ke dashboard
      dispatch(setAuth(res.data));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login gagal");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" px={2}>
      <Card
        sx={{
          width: { xs: "100%", sm: 400, md: 450 },
          maxWidth: "100%",
          p: 3,
          borderRadius: 4,
          backgroundColor: colors.primary[500],
        }}
      >
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: "semiBold", textAlign: "center", mb: 1 }}>
            Selamat Datang
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}>
            Silakan login untuk melanjutkan.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Email" fullWidth color="grey" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth color="grey" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Typography variant="body2" textAlign="right">
              <Link to="/forget-password" style={{ textDecoration: "none", color: "#1976d2" }}>
                Lupa Password?
              </Link>
            </Typography>
            <Button onClick={handleLogin} variant="contained" size="large" fullWidth color="secondary">
              Sign In
            </Button>
            <Button component={Link} to="/register" variant="outlined" size="large" fullWidth color="secondary" sx={{ mt: 2 }}>
              Daftar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
