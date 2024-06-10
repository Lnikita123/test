import { create } from "zustand";

interface IuseBoardStore {
  showSelectSquares: boolean;
  selectedOption: string;
  selectedSquare: string[];
  isBoardClick: boolean;
  boardMoves: string[];
  hideInputField: boolean;
  onClickAdd: boolean;
  setOnClickAdd: (onClickAdd: boolean) => void;
  setHideInputField: (hideInputField: boolean) => void;
  setBoardMoves: (boardMoves: string[]) => void;
  setIsBoardClick: (isBoardClick: boolean) => void;
  setSelectedSquare: (selectedSquare: string[]) => void;
  setSelectedOption: (selectedOption: string) => void;
  setShowSelectSquares: (showSelectSquares: boolean) => void;
}
export const useBoardStore = create<IuseBoardStore>((set) => ({
  showSelectSquares: false,
  selectedOption: "position",
  selectedSquare: [],
  isBoardClick: false,
  boardMoves: [],
  hideInputField: false,
  onClickAdd: true,
  setOnClickAdd: (onClickAdd) => set((state) => ({ ...state, onClickAdd })),
  setBoardMoves: (boardMoves: string[]) =>
    set((state) => ({ ...state, boardMoves })),
  setHideInputField: (hideInputField) =>
    set((state) => ({ ...state, hideInputField })),
  setIsBoardClick: (isBoardClick) =>
    set((state) => ({ ...state, isBoardClick })),
  setSelectedSquare: (selectedSquare: string[]) =>
    set((state) => ({ ...state, selectedSquare })),
  setSelectedOption: (selectedOption) => set((state) => ({ selectedOption })),
  setShowSelectSquares: (showSelectSquares) =>
    set((state) => ({ ...state, showSelectSquares })),
}));
