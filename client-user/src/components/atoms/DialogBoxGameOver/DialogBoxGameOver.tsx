import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import React from "react";

const DialogBoxGameOver = ({ open, handleClose }: any) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Game over
        </DialogContentText>
      </DialogContent>

      <Button onClick={handleClose} color="primary">
        <span className="bg-green-500 px-3 py-1 rounded-md ">OK</span>
      </Button>
    </Dialog>
  );
};

export default DialogBoxGameOver;
