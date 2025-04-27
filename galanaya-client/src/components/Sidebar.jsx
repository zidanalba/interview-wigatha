import { React, useEffect, useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import GestureOutlinedIcon from "@mui/icons-material/GestureOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import EggOutlinedIcon from "@mui/icons-material/EggOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../theme";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem active={selected === title} icon={icon} onClick={() => setSelected(title)} component={<Link to={to} />}>
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  const location = useLocation();

  const menuSections = [
    {
      items: [{ title: "Dashboard", to: "/dashboard", icon: <GridViewOutlinedIcon /> }],
    },
    {
      title: "Transaksi",
      items: [
        { title: "Penjualan A", to: "/penjualan", icon: <HandshakeOutlinedIcon /> },
        { title: "Penjualan B", to: "/penjualan", icon: <ShoppingBagOutlinedIcon /> },
        { title: "Pencairan", to: "/pencairan", icon: <MonetizationOnOutlinedIcon /> },
        { title: "Pengembalian", to: "/pengembalian", icon: <KeyboardReturnOutlinedIcon /> },
        { title: "Pengeluaran", to: "/pengeluaran", icon: <PaymentOutlinedIcon /> },
      ],
    },
    {
      title: "Produksi",
      items: [
        { title: "Pembelian Bahan", to: "/pembelian-bahan", icon: <GestureOutlinedIcon /> },
        { title: "Produksi", to: "/produksi", icon: <WarehouseOutlinedIcon /> },
      ],
    },
    {
      title: "Master",
      items: [
        { title: "Customer", to: "/customer", icon: <GroupsOutlinedIcon /> },
        { title: "Produk", to: "/produk", icon: <CheckroomOutlinedIcon /> },
        { title: "Jenis Pengeluaran", to: "/jenis-pengeluaran", icon: <SellOutlinedIcon /> },
        { title: "Bahan Baku", to: "/bahan-baku", icon: <EggOutlinedIcon /> },
        { title: "Unit Bisnis", to: "/unit-bisnis", icon: <StorefrontOutlinedIcon /> },
      ],
    },
    {
      title: "Settings",
      items: [
        { title: "User", to: "/users", icon: <PeopleAltOutlinedIcon /> },
        { title: "Role Akses", to: "/role-akses", icon: <VpnKeyOutlinedIcon /> },
      ],
    },
  ];

  useEffect(() => {
    const allItems = menuSections.flatMap((section) => section.items);
    const matched = allItems.find((item) => location.pathname.startsWith(item.to));
    if (matched) {
      setSelected(matched.title);
    }
  }, [location.pathname]);

  return (
    <Box
      className="custom-sidebar-scroll"
      sx={{
        height: "100vh",
        overflowY: "auto",
        position: "sticky", // agar tetap scrollable tapi tidak absolute
        top: 0,
      }}
    >
      <ProSidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary[400]}
        rootStyles={{
          borderRight: "none",
        }}
      >
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: ({ active }) => ({
              padding: "5px 35px 5px 20px",
              color: active ? colors.blueAccent[400] : colors.grey[100],
              "&:hover": {
                backgroundColor: colors.primary[400],
                color: colors.blueAccent[500], // brighter hover text color
              },
            }),
            icon: {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* Logo and Menu Icon */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" color={colors.grey[100]}>
                  Core
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/users.jpg`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                  Zidan
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  Super Admin
                </Typography>
              </Box>
            </Box>
          )}
          <Box>
            {menuSections.map((section, idx) => (
              <Box key={idx}>
                {!isCollapsed && section.title && (
                  <Typography variant="body1" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
                    {section.title}
                  </Typography>
                )}
                {section.items.map(({ title, to, icon }) => (
                  <Item key={title + to} title={title} to={to} icon={icon} selected={selected} setSelected={setSelected} />
                ))}
              </Box>
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
