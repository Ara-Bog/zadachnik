import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";

export default function DialogComponent({ openDialog, dialogData, callback }) {
  const handleClose = () => {
    callback(false);
  };

  const handleAgree = () => {
    callback(true);
  };

  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{dialogData.label}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogData.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="border-button border--green color--green" onClick={handleAgree}>
          Подтвердить
        </button>
        <button className="border-button border--red color--orange" onClick={handleClose}>
          Отмена
        </button>
      </DialogActions>
    </Dialog>
  );
}
