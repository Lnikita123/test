import { create } from "zustand";
export interface Option {
  optionNumber: number;
  isChecked: boolean;
  imageName: string;
  location?: string | undefined;
}

export interface IOption {
  storeOptions: Option[];
  setStoreOptions: (storeOptions: Option[]) => void;
  selectedSquare: string;
  setSelectedSquare: (selectedSquare: string) => void;
}

const useDrop = create<IOption>((set) => ({
  storeOptions: [],
  selectedSquare: "",
  setSelectedSquare: (selectedSquare) => set({ selectedSquare }),
  setStoreOptions: (storeOptions: Option[]) => set({ storeOptions }),
}));

export default useDrop;
