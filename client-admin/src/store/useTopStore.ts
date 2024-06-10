import { create } from "zustand";
interface IUseTopStore {
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
  text: boolean;
  image: boolean;
  twoImage: boolean;
  video: boolean;
  mcq: boolean;
  hint: boolean;
  setText: (text: boolean) => void;
  setImage: (image: boolean) => void;
  setTwoImage: (twoImage: boolean) => void;
  setVideo: (video: boolean) => void;
  setMcq: (mcq: boolean) => void;
  setHint: (hint: boolean) => void;
}

// export const useToptore = create<IUseToptore>((set)=>())

export const useTopStore = create<IUseTopStore>((set) => ({
  selectedOption: "text",
  setSelectedOption: (selectedOption) => set(() => ({ selectedOption })),
  text: false,
  image: false,
  twoImage: false,
  video: false,
  mcq: false,
  hint: false,
  setText: (text) => set((state) => ({ ...state, text })),
  setImage: (image) => set((state) => ({ ...state, image })),
  setTwoImage: (twoImage) => set((state) => ({ ...state, twoImage })),
  setVideo: (video) => set((state) => ({ ...state, video })),
  setHint: (hint) => set((state) => ({ ...state, hint })),
  setMcq: (mcq) => set((state) => ({ ...state, mcq })),
}));
