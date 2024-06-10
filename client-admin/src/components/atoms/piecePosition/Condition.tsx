import { ICondition } from "@/store/usePieceHistory";

function Condition({ condition }: { condition: ICondition }) {
  const { color = "", from = "", to = "", piece = "" } = condition || {};

  return (
    <div className="m-1 border border-1 border-white rounded-lg">
      <center className="font-bold">Select piece</center>
      <p className="mx-1">Color</p>
      <input
        value={color}
        name="color"
        className="border border-[#01579B] rounded-lg p-2 w-60 m-3"
      />
      <p className="mx-1">Piece</p>
      <input
        value={piece}
        name="piece"
        className="border border-[#01579B] rounded-lg p-2 w-60 m-3"
      />
      <p className="mx-1">Initial position</p>
      <input
        type="text"
        className="border border-[#01579B] rounded-lg p-2 w-60 m-3"
        value={from}
        name="from"
      ></input>
      <p className="mx-1">Final position</p>
      <input
        type="text"
        className="border border-[#01579B] rounded-lg p-2 w-60 m-3"
        value={to}
        name="to"
      ></input>
      <br />
    </div>
  );
}
export default Condition;
