import { create } from "zustand";

interface IusePieceDrop {
  pieceState: {
    position: object;
    selectChessElement: string;
    selectSquareLocation: string;
  };
  setPieceState: (newState: {
    position?: object;
    selectChessElement?: string;
    selectSquareLocation?: string;
  }) => void;
}

const usePieceDrop = create<IusePieceDrop>((set) => ({
  pieceState: {
    position: {},
    selectChessElement: "",
    selectSquareLocation: "",
  },
  setPieceState: (newState) =>
    set((state) => ({
      pieceState: {
        ...state.pieceState,
        ...newState,
      },
    })),
}));

export default usePieceDrop;
