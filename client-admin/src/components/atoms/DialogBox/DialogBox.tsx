import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { usePageStore } from "@/store/usePageStore";
import { useUnitStore } from "@/store/useUnitStore";

export default function DialogBox() {
  // const isOpen = usePageStore((s) => s.isOpen);
  // const setIsOpen = usePageStore((s) => s.setIsOpen);
  const onConfirm = usePageStore((s) => s.onConfirm);
  const setOnConfirm = usePageStore((s) => s.setOnConfirm);
  const openAlert = useUnitStore((S) => S.openAlert);
  const setOpenAlert = useUnitStore((s) => s.setOpenAlert);
  const onUnitConfirm = useUnitStore((s) => s.onUnitConfirm);
  const setOnUnitConfirm = useUnitStore((s) => s.setOnUnitConfirm);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    // setIsOpen(false);
    setOpenAlert(false);
  };
  const handleAgree = () => {
    // setOnConfirm(true);
    setOnUnitConfirm(true);
  };
  const handleDisagree = () => {
    // setOnConfirm(false);
    setOnUnitConfirm(false);
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openAlert}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choosing This option clears previous changes. Agree to delete
            Disagree to discard
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDisagree}>
            <span className="bg-red-500 px-3 py-1 rounded-xl">Disagree</span>
          </Button>
          <Button onClick={handleAgree} autoFocus>
            <span className="bg-green-500 px-3 py-1 rounded-xl">Agree</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
