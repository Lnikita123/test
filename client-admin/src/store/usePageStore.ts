import { create } from "zustand";

interface IPageStore {
  chapterId: string;
  hint: string[];
  position: [
    {
      pieces: [
        {
          location: { type: String };
          pieceName: { type: String };
        }
      ];
      arrows: [
        {
          start: { type: Object };
          end: { type: Object };
          color: { type: String };
        }
      ];
      lines: [
        {
          start: { type: Object };
          end: { type: Object };
          color: { type: String };
        }
      ];
      brush: [
        {
          position: { type: String };
          color: { type: String };
        }
      ];
      screen: [
        {
          position: { type: String };
          color: { type: String };
          animate: { type: Boolean };
        }
      ];
    }
  ];
  pieceMove: {
    user: {
      color: string;
      piece: string;
      from: string;
      to: string;
      flags: string;
      san: string;
    };
    system: {
      color: string;
      piece: string;
      from: string;
      to: string;
      flags: string;
      san: string;
    };
  }[];
  board: {
    AddedBlocks: string[];
  };
  dropPieces: {
    conditions: {
      type: string;
      color: string;
      isChecked: boolean;
    }[];
    dropPosition: string[];
  }[];
  isDeleted: boolean;
}

interface IUsePageStore {
  pageId: string;
  setPageId: (pageId: string) => void;
  toggleOptionColor: boolean;
  setToggleOptionColor: (toggleColor: boolean) => void;
  toggleInteractiveColor: boolean;
  setToggleInteractiveColor: (toggleColor: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: boolean;
  setOnConfirm: (onConfirm: boolean) => void;
  chessboardWrapper: HTMLElement | null;
  setChessboardWrapper: (element: HTMLElement | null) => void;
  board: boolean;
  piece: boolean;
  drop: boolean;
  position: boolean;
  hint: boolean;
  metaTags: boolean;
  data: IPageStore[];
  openAlert: boolean;
  setOpenAlert: (openAlert: boolean) => void;
  setData: (dat: IPageStore) => void;
  isPageLoaded: boolean;
  setIsPageLoaded: (isPageLoaded: boolean) => void;
  pageData: IPageStore[];
  setPageData: (pageDat: IPageStore) => void;
  setBoard: (board: boolean) => void;
  setPiece: (piece: boolean) => void;
  setDrop: (drop: boolean) => void;
  setHint: (hint: boolean) => void;
  setMetaTags: (metaTags: boolean) => void;
  setPosition: (position: boolean) => void;
}
const usePageStore = create<IUsePageStore>((set, get) => ({
  pageId: "",
  setPageId: (pageId) => set((state) => ({ ...state, pageId })),
  toggleOptionColor: false,
  setToggleOptionColor: (toggleOptionColor: boolean) =>
    set({ toggleOptionColor }),
  toggleInteractiveColor: false,
  setToggleInteractiveColor: (toggleOptionColor: boolean) =>
    set({ toggleOptionColor }),
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  onConfirm: false,
  setOnConfirm: (onConfirm: boolean) => set({ onConfirm }),
  chessboardWrapper: null,
  setChessboardWrapper: (element) => set({ chessboardWrapper: element }),
  openAlert: false,
  setOpenAlert: (openAlert) => set((state) => ({ openAlert })),
  board: false,
  piece: false,
  drop: false,
  position: false,
  hint: false,
  metaTags: false,
  data: [],
  setData: (dat) => set((state) => ({ data: [...state.data, dat] })),
  isPageLoaded: false,
  setIsPageLoaded: (isPageLoaded) =>
    set((state) => ({ ...state, isPageLoaded })),
  pageData: [],
  setPageData: (pageDat) =>
    set((state) => ({ pageData: [...state.pageData, pageDat] })),
  setBoard: (board) => set((state) => ({ ...state, board })),
  setPiece: (piece) => set((state) => ({ ...state, piece })),
  setDrop: (drop) => set((state) => ({ ...state, drop })),
  setHint: (hint) => set((state) => ({ ...state, hint })),
  setMetaTags: (metaTags) => set((state) => ({ ...state, metaTags })),
  setPosition: (position) => set((state) => ({ ...state, position })),
}));
export { usePageStore };
