import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IusePlayComputer {
  label: string;
  setLabel: (value: string) => void;
}

const usePlayComputer = create(
  persist<IusePlayComputer>(
    (set) => ({
      label: "250",
      setLabel: (label) => set(() => ({ label: label })),
    }),
    {
      name: "PlayComputer",
    }
  )
);
export { usePlayComputer };
