import { create } from "zustand";
export const headingBodyStyle = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontFamily: "sans",
  fontSize: "text-base",
  textAlign: "text-left",
};
export interface IStyles {
  bold: boolean;
  fontFamily: string;
  fontSize: string;
  italic: boolean;
  strikethrough: boolean;
  textAlign: string;
  underline: boolean;
}

export interface ITextData {
  heading: string;
  body: string;
  headingStyles: IStyles;
  bodyStyles: IStyles;
}
export interface IOneImageData {
  heading: string;
  body: string;
  headingStyles: IStyles;
  bodyStyles: IStyles;
  image: string;
}
export interface ITwoImage {
  heading: string;
  headingStyles: IStyles;
  image1: string;
  image2: string;
  body1: string;
  bodyStyles1: IStyles;
  body2: string;
  bodyStyles2: IStyles;
}
export interface Ivideo {
  heading: string;
  body: string;
  headingStyles: IStyles;
  bodyStyles: IStyles;
  video: string;
  url: string;
}
export interface Option {
  id: number;
  value: string;
  isChecked: boolean;
}
export interface IMCQ {
  heading: string;
  headingStyles: IStyles;
  options: Option[];
  hint: string;
  wrong: string;
}
interface IUseBottomStore {
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
export const useBottomStore = create<IUseBottomStore>((set) => ({
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
