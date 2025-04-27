import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import VerifikasiDialog from "../components/VerifikasiDialog";

const PrivateRoute = () => {
  const auth = useSelector((state) => state.auth);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (auth?.token && auth.is_active === false) {
      setShowDialog(true);
    }
  }, [auth]);

  const handleCloseDialog = () => {
    setShowDialog(false);
    window.location.href = "/login";
  };

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  if (auth.is_active === false) {
    return <VerifikasiDialog open={showDialog} onClose={handleCloseDialog} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
