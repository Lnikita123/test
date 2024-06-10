import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IuseStudentStore {
  name: string | undefined;
  setName: (name: string) => void;
  email: string | undefined;
  setEmail: (email: string) => void;
  avatar: string | undefined;
  setAvatar: (avatar: string | undefined) => void;
}
const useStudent = create(
  persist<IuseStudentStore>(
    (set) => ({
      name: "",
      setName: (name) => set((state) => ({ ...state, name })),
      email: "",
      setEmail: (email) => set((state) => ({ ...state, email })),
      avatar: "",
      setAvatar: (avatar) => set((state) => ({ ...state, avatar })),
    }),
    {
      name: "studentDetails",
    }
  )
);

export default useStudent;
