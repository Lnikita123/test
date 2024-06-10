import { create } from "zustand";
import { IStyles, headingBodyStyle } from "./useBottomStore";
interface ITopBottomStyles {
  headingText: string;
  bodyText: string;
  bodyText2: string;
  headingStyles: IStyles;
  bodyStyles: IStyles;
  bodyStyles2: IStyles;
  headingCount: number;
  bodyCount: number;
  bodyCount2: number;
  selectedImage: string;
  selectedImage2: string;
  setSelectedImage: (selectedImage: string) => void;
  setSelectedImage2: (selectedImage2: string) => void;
  setHeadingText: (headingText: string) => void;
  setBodyText: (bodyText: string) => void;
  setBodyText2: (bodyText2: string) => void;
  setHeadingStyles: (headingStyles: IStyles) => void;
  setBodyStyles: (bodyStyles: IStyles) => void;
  setBodyStyles2: (bodyStyles2: IStyles) => void;
  setHeadingCount: (headingCount: number) => void;
  setBodyCount: (bodyCount: number) => void;
  setBodyCount2: (bodyCount2: number) => void;
  updateHeadingStyles: (
    updateFunction: (prevState: IStyles) => IStyles
  ) => void;
  updateBodyStyles: (updateFunction: (prevState: IStyles) => IStyles) => void;
  updateBodyStyles2: (updateFunction: (prevState: IStyles) => IStyles) => void;
}

const useTopBottomStyles = create<ITopBottomStyles>((set) => ({
  headingText: "",
  bodyText: "",
  bodyText2: "",
  headingStyles: headingBodyStyle,
  bodyStyles: headingBodyStyle,
  bodyStyles2: headingBodyStyle,
  headingCount: 0,
  bodyCount: 0,
  bodyCount2: 0,
  selectedImage: "",
  setSelectedImage: (selectedImage: string) => set(() => ({ selectedImage })),
  selectedImage2: "",
  setSelectedImage2: (selectedImage2: string) =>
    set(() => ({ selectedImage2 })),
  setHeadingText: (headingText: string) => set((state) => ({ headingText })),
  setBodyText: (bodyText: string) => set((state) => ({ bodyText })),
  setBodyText2: (bodyText2: string) => set((state) => ({ bodyText2 })),
  setHeadingCount: (headingCount: number) => set((state) => ({ headingCount })),
  setBodyCount: (bodyCount: number) => set((state) => ({ bodyCount })),
  setBodyCount2: (bodyCount2: number) =>
    set((state) => ({ ...state, bodyCount2 })),
  setHeadingStyles: (headingStyles: IStyles) =>
    set((state) => ({ ...state, headingStyles })),
  setBodyStyles: (bodyStyles: IStyles) => set((state) => ({ bodyStyles })),
  setBodyStyles2: (bodyStyles2: IStyles) => set((state) => ({ bodyStyles2 })),
  updateHeadingStyles: (updateFunction: (prevState: IStyles) => IStyles) =>
    set((state) => ({
      ...state,
      headingStyles: updateFunction(state.headingStyles),
    })),
  updateBodyStyles: (updateFunction: (prevState: IStyles) => IStyles) =>
    set((state) => ({
      ...state,
      bodyStyles: updateFunction(state.bodyStyles),
    })),
  updateBodyStyles2: (updateFunction: (prevState: IStyles) => IStyles) =>
    set((state) => ({
      ...state,
      bodyStyles2: updateFunction(state.bodyStyles2),
    })),
}));

export default useTopBottomStyles;
