import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  MenuItem,
  Stack,
  styled,
  Switch,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/axios";
import { tokens } from "../../theme";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { CircularProgress } from "@mui/material";
import useAuth from "../../store/useAuth";

const UsersForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    is_active: false,
    business_units: [],
    roles: [],
  });
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { permissions } = useAuth();
  const hasPermission = (perm) => permissions.includes(perm);
  const canView = hasPermission("view_user_detail");
  const canUpdate = hasPermission("update_users");
  const isReadonly = isEdit && canView && !canUpdate;

  const checkEmailExists = async (email) => {
    setCheckingEmail(true);
    try {
      const res = await api.get(`/master/user/check-email`, {
        params: { email, exclude_id: id },
      });
      console.log(res);
      if (res.data.exists) {
        setEmailError("Email sudah digunakan.");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error("Gagal cek email:", err);
      setEmailError("Gagal mengecek email.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#1890ff",
          ...theme.applyStyles("dark", {
            backgroundColor: "#177ddc",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: "rgba(0,0,0,.25)",
      boxSizing: "border-box",
      ...theme.applyStyles("dark", {
        backgroundColor: "rgba(255,255,255,.35)",
      }),
    },
  }));

  const fetchRoles = async () => {
    try {
      const response = await api.get("master/role");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  };

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      alert("Gagal fetch data roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await api.get("master/business-unit");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching business units:", error);
      throw error;
    }
  };

  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const data = await fetchUnits();
      setUnits(data);
    } catch (err) {
      alert("Gagal fetch data business units");
    } finally {
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      setLoadingUser(true);
      api
        .get(`/master/user/${id}`)
        .then((res) => {
          console.log(res), "res edit";
          const user = res.data.data;
          setForm({
            name: user.name,
            email: user.email,
            is_active: user.is_active,
            roles: user.roles.map((role) => role.id),
            business_units: user.business_units.map((unit) => unit.id),
          });
        })
        .catch((err) => {
          console.error("Gagal ambil data user", err);
        })
        .finally(() => {
          setLoadingUser(false);
        });
    }
  }, [id]);

  useEffect(() => {
    loadRoles();
    loadUnits();
  }, []);

  const handleRoleCheckboxChange = (roleName) => {
    setForm((prevForm) => {
      const updatedRoles = prevForm.roles.includes(roleName) ? prevForm.roles.filter((r) => r !== roleName) : [...prevForm.roles, roleName];
      return { ...prevForm, roles: updatedRoles };
    });
  };

  const handleUnitCheckboxChange = (unitName) => {
    setForm((prevForm) => {
      const updatedUnits = prevForm.business_units.includes(unitName) ? prevForm.business_units.filter((r) => r !== unitName) : [...prevForm.business_units, unitName];
      return { ...prevForm, business_units: updatedUnits };
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (form.email) {
        checkEmailExists(form.email);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [form.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkingEmail || emailError) {
      alert("Mohon periksa email terlebih dahulu.");
      return;
    }

    try {
      if (isEdit) {
        console.log(form, "edit form after subit");
        await api.put(`/master/user/${id}`, form);
        alert("User berhasil diupdate.");
        navigate("/users");
      } else {
        await api.post("/master/user", form);
        setSuccessDialogOpen(true);
      }
    } catch (err) {
      console.error(err);
      // Coba ambil pesan error spesifik dari API kalau ada
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Gagal menyimpan data: ${err.response.data.message}`);
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
      }
    }
  };

  return (
    <Box m={2}>
      <Box>
        <Typography variant="h4">{isEdit ? (isReadonly ? "Lihat Detail User" : "Edit User") : "Tambah User"}</Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          <TextField
            color="secondary"
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loadingUser || isReadonly}
            InputProps={{
              endAdornment: <InputAdornment position="end">{loadingUser && <CircularProgress size={20} color="secondary" />}</InputAdornment>,
            }}
          />
          <TextField
            color="secondary"
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!emailError}
            helperText={emailError || (checkingEmail ? "Memeriksa email..." : "")}
            disabled={loadingUser || isReadonly}
            InputProps={{
              endAdornment: <InputAdornment position="end">{(checkingEmail || loadingUser) && <CircularProgress size={20} color="secondary" />}</InputAdornment>,
            }}
          />
          <Box display="flex" marginY={2}>
            <Box width="100%">
              <Typography variant="h5">Unit Bisnis</Typography>
              <Typography variant="caption" color="textDisabled">
                Unit bisnis berpengaruh pada data yang dapat dilihat oleh user.
              </Typography>
              <FormGroup>
                {loadingUnits ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height={50}>
                    <CircularProgress size={24} color="secondary" />
                  </Box>
                ) : units.length > 0 ? (
                  units.map((unit) => (
                    <FormControlLabel key={unit.id} control={<Checkbox disabled={isReadonly} checked={form.business_units.includes(unit.id)} onChange={() => handleUnitCheckboxChange(unit.id)} color="secondary" />} label={unit.name} />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Belum ada unit bisnis terdaftar.
                  </Typography>
                )}
              </FormGroup>
            </Box>
            <Box width="100%">
              <Typography variant="h5">Roles</Typography>
              <Typography variant="caption" color="textDisabled">
                Roles berpengaruh pada fitur yang dapat digunakan oleh user.
              </Typography>
              <FormGroup>
                {loadingRoles ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height={50}>
                    <CircularProgress size={24} color="secondary" />
                  </Box>
                ) : roles.length > 0 ? (
                  roles.map((role) => (
                    <FormControlLabel key={role.id} control={<Checkbox disabled={isReadonly} checked={form.roles.includes(role.id)} onChange={() => handleRoleCheckboxChange(role.id)} color="secondary" />} label={role.name} />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Belum ada role terdaftar.
                  </Typography>
                )}
              </FormGroup>
              {hasPermission("create_role_akes") && (
                <Box mt={1}>
                  <Button
                    variant="text"
                    color="success"
                    size="small"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => navigate("/role-akses/add")} // ganti dengan route buatanmu
                  >
                    Buat Role Baru
                  </Button>
                </Box>
              )}
            </Box>
            <Box width="100%">
              <Typography variant="h5">Status</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography color={!form.is_active ? "error" : "textSecondary"}>Tidak Aktif</Typography>
                <AntSwitch inputProps={{ "aria-label": "ant design" }} checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} disabled={loadingUser || isReadonly} />
                <Typography color={form.is_active ? "success" : "textSecondary"}>Aktif</Typography>
              </Stack>
            </Box>
          </Box>
          {(!isEdit && hasPermission("create_users")) || (isEdit && hasPermission("update_users")) ? (
            <Button color="secondary" type="submit" variant="outlined" fullWidth sx={{ mt: 2 }}>
              {isEdit ? "Update" : "Create"}
            </Button>
          ) : null}
        </form>
      </Box>
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle color="success">User berhasil dibuat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mohon beritahu user bahwa password default adalah <strong>'password'</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccessDialogOpen(false);
              navigate("/users"); // lanjut redirect setelah close
            }}
            color="success"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersForm;
