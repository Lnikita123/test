import { ShortMove } from "chess.js";
import { ReactNode } from "react";
import { create } from "zustand";
export type SquareStyles = { [key: string]: React.CSSProperties };
export interface HumanVsHumanProps {
  children: (args: {
    squareStyles: SquareStyles;
    position: string;
    onMouseOverSquare: (square: string) => void;
    onMouseOutSquare: (square: string) => void;
    onDrop: (move: ShortMove) => void;
    dropSquareStyle: React.CSSProperties;
    onDragOverSquare: (square: string) => void;
    onSquareClick: (square: string) => void;
    onSquareRightClick: (square: string) => void;
  }) => ReactNode;
}

export interface ICondition {
  color?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  piece?: string | undefined;
  flags?: string | undefined;
}
[];

export interface IConditionsStore {
  [key: string]: ICondition;
  user: ICondition;
  system: ICondition;
}
interface IusePieceHistory {
  fenString: string;
  setFenString: (fenString: string) => void;
  fenEnabled: boolean;
  setFenEnabled: (fenEnabled: boolean) => void;
  conditionStore: IConditionsStore;
  setConditionStore: (newConditionStore: Partial<IConditionsStore>) => void;

  allConditionStore: (IConditionsStore | undefined)[];
  setAllConditionStore: (
    newAllConditionStore: Partial<IConditionsStore[]>
  ) => void;
  updateAllConditionStore: () => void;

  pieceLocation: null | Record<string, any>;
  setPieceLocation: (piece: Record<string, any>) => void;
  conditionsStore: Array<{ user: ICondition[]; system: ICondition[] }>;
  setConditionsStore: (
    conditions: Array<{ user: ICondition[]; system: ICondition[] }>
  ) => void;
  setSaveUserMoves: () => void;
  setSaveSystemMoves: () => void;

  allConditions: Array<IConditionsStore>;
  setAllConditions: (conditions: Array<IConditionsStore>) => void;

  selectedRadio: string;
  setSelectedRadio: (selectedRadio: string) => void;

  activeConditionType: string;
  setActiveConditionType: (activeConditionType: string) => void;

  isLoading: Record<string, boolean>;
  setIsLoading: (id: string, state: boolean) => void;

  fenstringInteraction: string;
  setFenstringInteraction: (fenstringInteraction: string) => void;
}

export const usePieceHistory = create<IusePieceHistory>((set, get) => ({
  fenString: "",
  setFenString: (fenString: string) => set(() => ({ fenString })),
  fenstringInteraction: "",
  setFenstringInteraction: (fenstringInteraction: string) =>
    set(() => ({ fenstringInteraction })),
  fenEnabled: false,
  setFenEnabled: (fenEnabled: boolean) => set(() => ({ fenEnabled })),
  conditionStore: { user: {}, system: {} },
  setConditionStore: (newConditionStore) => {
    const mergedConditionStore = {
      ...get().conditionStore,
      ...newConditionStore,
    };
    set({ conditionStore: mergedConditionStore as IConditionsStore });
  },
  allConditionStore: [],
  setAllConditionStore: (allConditionStore) =>
    set(() => ({ allConditionStore })),
  updateAllConditionStore: () =>
    set({
      conditionStore: {
        user: {},
        system: {},
      },
      allConditionStore: [...get().allConditionStore, get().conditionStore],
    }),

  pieceLocation: null,
  setPieceLocation: (piece) => set({ pieceLocation: piece }),
  conditionsStore: [{ user: [], system: [] }],
  setConditionsStore: (conditions) => set({ conditionsStore: conditions }),
  setSaveUserMoves: () =>
    set((prev) => {
      const latestPieceLocation = prev.pieceLocation;
      const latestCondition = {
        color: latestPieceLocation?.color,
        from: latestPieceLocation?.from,
        to: latestPieceLocation?.to,
        piece: latestPieceLocation?.piece,
        flags: latestPieceLocation?.flags,
      };
      const latestConditionsStore = [...prev.conditionsStore];
      const latestUserConditions =
        latestConditionsStore[latestConditionsStore.length - 1]?.user || [];
      latestConditionsStore[latestConditionsStore.length - 1] = {
        ...latestConditionsStore[latestConditionsStore.length - 1],
        user: [...latestUserConditions, latestCondition],
      };
      return { ...prev, conditionsStore: latestConditionsStore };
    }),
  setSaveSystemMoves: () =>
    set((prev) => {
      const latestPieceLocation = prev.pieceLocation;
      const latestCondition = {
        color: latestPieceLocation?.color,
        from: latestPieceLocation?.from,
        to: latestPieceLocation?.to,
        piece: latestPieceLocation?.piece,
        flags: latestPieceLocation?.flags,
      };
      const latestConditionsStore = [...prev.conditionsStore];
      const latestSystemConditions =
        latestConditionsStore[latestConditionsStore.length - 1]?.system || [];
      latestConditionsStore[latestConditionsStore.length - 1] = {
        ...latestConditionsStore[latestConditionsStore.length - 1],
        system: [...latestSystemConditions, latestCondition],
      };
      return { ...prev, conditionsStore: latestConditionsStore };
    }),
  allConditions: [],
  setAllConditions: (conditions) => set({ allConditions: conditions }),
  selectedRadio: "user",
  setSelectedRadio: (radio: string) => set({ selectedRadio: radio }),
  activeConditionType: "user",
  setActiveConditionType: (activeConditionType: any) =>
    set({ activeConditionType }),
  isLoading: {},
  setIsLoading: (id, state) =>
    set((prevState) => ({
      isLoading: {
        ...prevState.isLoading,
        [id]: state,
      },
    })),
}));
