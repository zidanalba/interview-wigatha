import { Box } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      {children}
    </Box>
  );
};

export default AuthLayout;
