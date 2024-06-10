import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface IuseUnitState {
  selectedId: string | undefined;
  setSelectedId: (id: string | undefined) => void;
}
const useUnit = create(
  persist<IuseUnitState>(
    (set, get) => ({
      selectedId: "",
      setSelectedId: (selectedId) => set((state) => ({ ...state, selectedId })),
    }),
    {
      name: "useUnit", // Name your store
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUnit };
