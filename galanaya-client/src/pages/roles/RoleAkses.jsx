import { Box, Button, Stack, Typography, styled, Switch, CircularProgress, IconButton, AccordionActions, Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import Accordion, { accordionClasses } from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails, { accordionDetailsClasses } from "@mui/material/AccordionDetails";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import api from "../../utils/axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const RoleAkses = () => {
  const [expanded, setExpanded] = useState(false);

  const [form, setForm] = useState("");

  const [isEditing, setIsEditing] = useState(null);

  const [rolesPermissions, setRolesPermissions] = useState([]);

  const [permissions, setPermissions] = useState([]);

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
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
    },
  }));

  const handleExpansion = (panel) => {
    setExpanded((prevExpanded) => (prevExpanded === panel ? false : panel));
  };

  const handleEditRole = (role) => {
    setIsEditing(role.id);
    console.log(role, "role that being edited");
    setForm({
      ...form,
      role,
    });
  };

  const handleUpdateRole = async () => {
    try {
      console.log(form, "form after edit");
      await api.put(`master/role/${form.role.id}`, form);
      setOpenSuccessSnackbar(true);
      setForm({});
      loadRolesPermissions();
      setIsEditing(null);
    } catch (err) {
      alert("Gagal mengupdate role");
    }
  };

  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const fetchRolesPermissions = async () => {
    try {
      const response = await api.get("master/roles-and-permissions");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  };

  const loadRolesPermissions = async () => {
    setLoadingPermissions(true);
    try {
      const data = await fetchRolesPermissions();
      setRolesPermissions(data);
    } catch (err) {
      alert("Gagal fetch data roles");
    } finally {
      setLoadingPermissions(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get("master/permission");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
  };

  const loadPermissions = async () => {
    setLoadingPermissions(true);
    try {
      const data = await fetchPermissions();
      setPermissions(data);
      console.log(data, "permissions");
    } catch (err) {
      alert("Gagal fetch data permissions");
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    loadPermissions();
    loadRolesPermissions();
  }, []);

  return (
    <Box ml={2} mr={2}>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Typography variant="h4">Role Akses</Typography>
        <Button variant="outlined" startIcon={<AddOutlinedIcon />} color="success">
          Tambah Role dan Akses
        </Button>
      </Box>
      <Box>
        {loadingPermissions ? (
          <CircularProgress size={24} color="secondary" />
        ) : (
          rolesPermissions.map((role) => (
            <Accordion
              key={role.id}
              expanded={expanded === role.id}
              onChange={(e, isExpanded) => handleExpansion(isExpanded ? role.id : false)}
              slots={{ transition: Fade }}
              slotProps={{ transition: { timeout: 400 } }}
              sx={[
                expanded === role.id
                  ? {
                      [`& .${accordionClasses.region}`]: {
                        height: "auto",
                      },
                      [`& .${accordionDetailsClasses.root}`]: {
                        display: "block",
                      },
                    }
                  : {
                      [`& .${accordionClasses.region}`]: {
                        height: 0,
                      },
                      [`& .${accordionDetailsClasses.root}`]: {
                        display: "none",
                      },
                    },
              ]}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id={`panel-${role.id}`}>
                <Typography mr={2} component="span">
                  <strong>{role.name}</strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" gap={2}>
                  {permissions.map((permission) => {
                    const isEditingThisRole = isEditing === role.id;

                    const isPermissionAssigned = isEditingThisRole ? form.role?.permissions?.some((perm) => perm.id === permission.id) : role.permissions.some((rolePermission) => rolePermission.id === permission.id);

                    return (
                      <Box key={permission.id} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{permission.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography color={!isPermissionAssigned ? "error" : "textSecondary"}>Tidak Aktif</Typography>
                          <AntSwitch
                            onChange={(e) => {
                              if (!isEditingThisRole) return; // Cegah perubahan kalau tidak sedang edit

                              const updatedPermissions = e.target.checked ? [...form.role.permissions, { id: permission.id, name: permission.name }] : form.role.permissions.filter((perm) => perm.id !== permission.id);

                              setForm({
                                ...form,
                                role: {
                                  ...form.role,
                                  permissions: updatedPermissions,
                                },
                              });
                            }}
                            disabled={isEditing !== role.id}
                            inputProps={{ "aria-label": "ant design" }}
                            checked={isPermissionAssigned}
                          />
                          <Typography color={isPermissionAssigned ? "success" : "textSecondary"}>Aktif</Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>

              <AccordionActions>
                {isEditing === role.id ? (
                  <Button variant="contained" color="secondary" onClick={handleUpdateRole}>
                    Update
                  </Button>
                ) : (
                  <Button variant="outlined" color="secondary" onClick={() => handleEditRole(role)}>
                    Edit
                  </Button>
                )}
              </AccordionActions>
            </Accordion>
          ))
        )}
      </Box>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          Berhasil update role.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleAkses;
