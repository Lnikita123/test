import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, useTheme } from "@mui/material/styles";

const PopUp = ({ open, setOpen, text, handleClose }: any) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClosed = () => {
    setOpen(false);
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClosed}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center" }}>
            <span className="m-5 font-bold text-black">{text}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClosed} autoFocus>
            <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded-md">
              Ok
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PopUp;
