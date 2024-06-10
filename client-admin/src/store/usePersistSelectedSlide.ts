import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface IusePersistSelectedSlide {
  selectedSlide: string | "";
  setSelectedSlide: (id: string | "") => void;
}

const usePersistSelectedSlide = create(
  persist<IusePersistSelectedSlide>(
    (set) => ({
      selectedSlide: "",
      setSelectedSlide: (selectedSlide) =>
        set((state) => ({ ...state, selectedSlide: selectedSlide || "" })),
    }),
    {
      name: "Slide",
    }
  )
);

export { usePersistSelectedSlide };
