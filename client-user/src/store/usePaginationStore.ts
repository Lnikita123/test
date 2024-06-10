import { create } from "zustand";
import { persist } from "zustand/middleware";

type PageIndexMapping = { [pageId: string]: number };
type PaginationState = {
  currentPage: number;
  setCurrentPage: (page: number | ((prevPage: number) => number)) => void;
  readyPage: number;
  setReadyPage: (page: number | ((prevPage: number) => number)) => void;
  pageIndexMapping: PageIndexMapping;
  setPageIndexMapping: (mapping: PageIndexMapping) => void;
  totalPoints: number;
  setTotalPoints: (points: number) => void;
};

const usePaginationStore = create(
  persist<PaginationState>(
    (set) => ({
      currentPage: 0,
      setCurrentPage: (page) =>
        set((state) => ({
          ...state,
          currentPage:
            typeof page === "function" ? page(state.currentPage) : page,
        })),
      readyPage: 0,
      setReadyPage: (page) =>
        set((state) => ({
          ...state,
          readyPage: typeof page === "function" ? page(state.readyPage) : page,
        })),
      pageIndexMapping: {},
      setPageIndexMapping: (mapping) =>
        set((state) => ({
          ...state,
          pageIndexMapping: mapping,
        })),
      totalPoints: 0,
      setTotalPoints: (points) =>
        set((state) => ({
          ...state,
          totalPoints: points,
        })),
    }),
    {
      name: "usePaginationStore",
    }
  )
);

export default usePaginationStore;
