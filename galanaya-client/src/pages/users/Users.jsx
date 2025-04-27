import { Avatar, Box, Button, Chip, colors, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { tokens } from "../../theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import api from "../../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const rows = [
  { id: "1", name: "Zidan", email: "zidan@example.com" },
  { id: "2", name: "Raka", email: "raka@example.com" },
  // Data dari API
];

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [userToDeleteName, setUserToDeleteName] = useState("");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "business_units",
      headerName: "Unit Bisnis",
      renderCell: (params) => {
        return params.row.business_units ? (
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              height: "100%",
              minHeight: "36px",
            }}
          >
            {params.row.business_units.map((unit) => (
              <Tooltip key={unit.id} title={unit.name} arrow>
                <Avatar sx={{ bgcolor: colors.blueAccent[500], width: 24, height: 24, fontSize: 12 }}>
                  {unit.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}{" "}
                </Avatar>
              </Tooltip>
            ))}
          </Box>
        ) : (
          ""
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => {
        return params.row.role_name ? params.row.role_name : "";
      },
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => <Chip variant="outlined" label={params.value ? "Aktif" : "Tidak Aktif"} color={params.value ? "success" : "error"} size="small" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            height: "100%",
            minHeight: "36px",
          }}
        >
          <Button size="small" color="secondary" variant="outlined" onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row)}>
            Delete
          </Button>
        </Box>
      ),
      width: 200,
    },
  ];

  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = (user) => {
    setUserIdToDelete(user.id);
    setUserToDeleteName(user.name);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`master/user/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteDialogOpen(false);
      alert("Gagal menghapus user.");
    }
  };

  const fetchUsers = async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get("master/user", {
        params: {
          page: page,
          per_page: pageSize,
        },
      });
      console.log(response, "fetchUsers");
      return {
        users: response.data.data.data,
        total: response.data.data.total,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { users, total } = await fetchUsers(page + 1, pageSize);
      setUsers(users);
      setRowCount(total);
    } catch (err) {
      alert("Gagal fetch data users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize]);

  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Box>
          <Typography variant="h4">Users</Typography>
        </Box>

        <Box>
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
            variant="standard"
          />
          <Button sx={{ ml: 2 }} variant="outlined" startIcon={<AddOutlinedIcon />} color="success" onClick={() => navigate("/users/add")}>
            Tambah
          </Button>
        </Box>
      </Box>
      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnResize={true}
        disableColumnSorting
        rows={users}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        paginationModel={{
          page: page,
          pageSize: pageSize,
        }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        rowCount={rowCount}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah anda yakin ingin <strong>menghapus</strong> user <strong>{userToDeleteName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Kembali
          </Button>
          <Button onClick={confirmDelete} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
