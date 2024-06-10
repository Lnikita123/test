import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ScoreBoard = ({
  userPoints,
  totalPoints,
  InActivateScoreBoard,
}: {
  userPoints: number;
  totalPoints: number;
  InActivateScoreBoard: () => void;
}) => {
  const [board, setBoard] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    InActivateScoreBoard();
    setBoard(false);
  };
  console.log("userPoints", userPoints);
  console.log("total", totalPoints);
  const percentage = (userPoints / totalPoints) * 100;
  return (
    <>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={board}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          PaperProps={{
            style: {
              background:
                "linear-gradient(to bottom, #765188 0%, rgba(38, 44, 85, 0.95) 86.33%)",
              boxShadow:
                "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(18.5px)",
              border: "1px solid #DDDDDD",

              height: "450px",
              width: "300px",
              borderRadius: "10px",
            },
          }}
        >
          <DialogContent>
            <DialogContentText className="text-center">
              <span className="text-4xl font-bold text-center text-white ">
                Score
              </span>
              <img
                src="/scoreImage.svg"
                alt="score"
                className="h-full w-full 2xl:w-11/12 ml-5"
              />
              <p className="text-white">
                Good performance with little more attention to detail.
              </p>
              <table className="table-auto mt-8">
                <tbody>
                  <tr>
                    <td className="text-white text-left">
                      <div className="my-2 ml-10">Score (%)</div>
                      <div className="my-2 ml-10">Points</div>
                    </td>
                    <td className="text-white">
                      <div className="my-2 ml-2">
                        {userPoints && totalPoints
                          ? Math.round(percentage)
                          : "-"}
                      </div>
                      <div className="my-2 ml-2">
                        {userPoints && totalPoints ? (
                          <span className="mx-1">{Math.round(userPoints)}</span>
                        ) : (
                          "-"
                        )}
                        / {totalPoints}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="justify-center bg-white">
            <Button autoFocus onClick={handleClose}>
              <span className="text-[#583469] rounded-lg font-bold mb-2 md:w-60">
                Okay
              </span>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ScoreBoard;
