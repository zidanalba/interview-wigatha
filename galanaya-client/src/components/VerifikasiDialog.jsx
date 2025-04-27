import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const VerifikasiDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Akun Belum Diverifikasi</DialogTitle>
      <DialogContent>Akun Anda belum diverifikasi oleh Admin. Silakan hubungi Admin untuk aktivasi akun Anda.</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Oke
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifikasiDialog;
