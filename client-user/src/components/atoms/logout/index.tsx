import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const LogoutButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    Cookies.remove("loggedin");
    router.push("/");
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
              <span className="m-5">
                Are you sure you want to logout session?
              </span>
              <br /> <br /> <span className="font-semibold">Yes</span> to accept
              <span className="font-semibold ml-2">No</span> to discard
            </DialogContentText>
          </DialogContent>
          <DialogActions className="justify-center">
            <Button autoFocus onClick={handleClose}>
              <span className="bg-red-500 text-white font-semibold px-3 py-1 rounded-xl">
                No
              </span>
            </Button>
            <Button onClick={logOut} autoFocus>
              <span className="bg-green-500 text-white font-semibold ml-2 px-3 py-1 rounded-xl">
                Yes
              </span>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <button
        type="submit"
        onClick={handleClickOpen}
        className="ml-7 mt-3 text-[#283272] bg-[#ECEFFF] rounded-full h-[2.5rem] w-[8rem] py-2 hover:transition hover:duration-300 hover:scale-110  font-bold"
      >
        Logout
      </button>
    </>
  );
};

export default LogoutButton;
