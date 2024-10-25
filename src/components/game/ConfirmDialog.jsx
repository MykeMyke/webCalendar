import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

export function ConfirmDialog(props) {
  const { open, onClose, onConfirm, gameName } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogContent>
        <Typography>You are about to drop from {gameName}</Typography>
        <br />
        <Typography>Are you sure? This cannot be undone</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={onConfirm}>
          Confirm drop
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
