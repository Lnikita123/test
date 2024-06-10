import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useUnitStore } from "@/store/useUnitStore";
import { useChapterStore } from "@/store/useChapterStore";
import { usePageStore } from "@/store/usePageStore";

const DeletePopUp = ({ open, onClose, onDelete }: any) => {
  const setOpen = useUnitStore((s) => s.setOpenAlert);
  const setOpenChapter = useChapterStore((s) => s.setOpenAlert);
  const setOpenPage = usePageStore((s) => s.setOpenAlert);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const onUnitConfirm = useUnitStore((s) => s.onUnitConfirm);
  const setOnUnitConfirm = useUnitStore((s) => s.setOnUnitConfirm);

  const handleClose = () => {
    setOpen(false);
    setOpenChapter(false);
    setOpenPage(false);
  };

  const handleDeleteItem = () => {
    // Perform the delete action
    setOpen(false);
    setOpenChapter(false);
    setOpenPage(false);
    setOnUnitConfirm(true);
    onDelete(); // Call the onDelete function passed from the parent component
  };

  return (
    <>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText className="text-center">
              Are you sure you want to delete this item?
              <br /> <br /> <span className="font-semibold">Yes</span> to
              confirm
              <span className="font-semibold ml-2">No</span> to cancel
            </DialogContentText>
          </DialogContent>
          <DialogActions className="justify-center">
            <Button autoFocus onClick={handleClose}>
              <span className="bg-red-500  text-white font-semibold rounded-xl px-3 py-1 ">
                No
              </span>
            </Button>
            <Button onClick={handleDeleteItem} autoFocus>
              <span className="bg-green-500  text-white font-semibold ml-2 rounded-xl px-3 py-1 ">
                Yes
              </span>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default DeletePopUp;
