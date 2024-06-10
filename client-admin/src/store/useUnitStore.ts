import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
export interface IuseUnitStore {
  id?: string | undefined;
  unitName?: string | undefined;
  unitNumber?: number | null;
  isPublished?: boolean;
  levels?: string;
}
export interface IuseUnitStoreState {
  units: IuseUnitStore[];
  modal: boolean;
  checked: boolean;
  isEditable: boolean;
  selectedId: string | undefined;
  editableUnit: IuseUnitStore;
  newUnit: IuseUnitStore;
  openAlert: boolean;
  onUnitConfirm: boolean | null;
  addUnit: (newUnit: IuseUnitStore) => void;
  updateUnitById: (id: string, updatedUnit: IuseUnitStore) => void;
  setOnUnitConfirm: (onConfirm: boolean | null) => void;
  setOpenAlert: (openAlert: boolean) => void;
  setSelectedId: (id: string | undefined) => void;
  setIsEditable: (isEditable: boolean) => void;
  setModal: (modal: boolean) => void;
  setChecked: (checked: boolean) => void;
  setUnits: (unit: IuseUnitStore[]) => void;
  setEditableUnit: (editableUnit: IuseUnitStore | undefined) => void;
  setNewUnit: (newUnit: IuseUnitStore) => void;
  setAllUnits: (units: IuseUnitStore[]) => void;
  updateEditableUnit: (key: string, value: string | number | boolean) => void;
}
export const useUnitStore = create<IuseUnitStoreState>((set) => ({
  units: [],
  modal: false,
  checked: false,
  isEditable: false,
  selectedId: "",
  editableUnit: {
    id: "",
    unitName: "",
    unitNumber: null,
    isPublished: false,
    levels: "beginner",
  },
  newUnit: {
    id: uuidv4(),
    unitName: "",
    unitNumber: null,
    isPublished: false,
    levels: "beginner",
  },
  openAlert: false,
  onUnitConfirm: false,
  setOnUnitConfirm: (onUnitConfirm: boolean | null) => set({ onUnitConfirm }),
  setOpenAlert: (openAlert) => set((state) => ({ openAlert })),
  setSelectedId: (selectedId) => set((state) => ({ ...state, selectedId })),
  setIsEditable: (isEditable) => set((state) => ({ ...state, isEditable })),
  setModal: (modal) => set((state) => ({ ...state, modal })),
  setChecked: (checked) => set((state) => ({ ...state, checked })),
  updateUnitById: (id: string, updatedUnit: IuseUnitStore) =>
    set((state) => {
      const index = state.units.findIndex((u) => u.id === id);
      if (index !== -1) {
        const newUnits = [...state.units];
        newUnits[index] = updatedUnit;
        return { units: newUnits };
      }
      return state;
    }),
  addUnit: (newUnit: IuseUnitStore) =>
    set((state) => {
      return { units: [...state.units, newUnit] };
    }),
  setUnits: (units: IuseUnitStore[]) =>
    set((state) => {
      const updatedUnits = Array.isArray(units)
        ? units.map((unit) => {
            const index = state.units.findIndex((u) => u.id === unit.id);
            if (index === -1) {
              // if the unit doesn't exist in the array, add it
              return unit;
            } else {
              // if the unit exists, update it
              return unit;
            }
          })
        : [];
      return { units: updatedUnits };
    }),
  setEditableUnit: (editableUnit) =>
    set((state) => ({ ...state, editableUnit })),
  setNewUnit: (newUnit: IuseUnitStore) =>
    set((state) => ({ ...state, newUnit })),
  setAllUnits: (units: IuseUnitStore[]) => set(() => ({ units })),
  updateEditableUnit: (key: string, value: any) =>
    set((state) => ({
      editableUnit: {
        ...state.editableUnit,
        [key]: value,
      },
    })),
}));
