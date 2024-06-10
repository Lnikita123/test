import { create } from "zustand";
export interface IuseSelectedSlide {
  selectedSlide: string | "";
  setSelectedSlide: (id: string | "") => void;
  slidePreviews: Record<string, string> | undefined;
  setSlidePreviews: (slidePreviews: Record<string, string>) => void;
  slideImage: Record<string, string> | undefined;
  setSlideImage: (slideImage: Record<string, string>) => void;
}

const useSelectedSlide = create<IuseSelectedSlide>((set) => ({
  selectedSlide: "",
  setSelectedSlide: (selectedSlide) =>
    set((state) => ({ ...state, selectedSlide: selectedSlide || "" })),
  slidePreviews: {},
  setSlidePreviews: (slidePreviews) =>
    set((state) => ({
      ...state,
      slidePreviews: { ...state.slidePreviews, ...slidePreviews },
    })),
  slideImage: {},
  setSlideImage: (slideImage) =>
    set((state) => ({
      ...state,
      slideImage: { ...state.slideImage, ...slideImage },
    })),
}));

export { useSelectedSlide };
