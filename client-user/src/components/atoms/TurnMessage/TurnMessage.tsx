import React from "react";

interface ITurnMessage {
  pgn: string;
  playerColor: string;
}
const TurnMessage = ({ pgn, playerColor }: ITurnMessage) => {
  return (
    <>
      {pgn.length === 0 && (
        <div className={`text-black text-sm self-center justify-self-center`}>
          {playerColor === "white" && (
            <p>Play the {playerColor} It's your Turn</p>
          )}
        </div>
      )}
    </>
  );
};

export default TurnMessage;
