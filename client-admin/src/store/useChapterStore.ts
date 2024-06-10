import { create } from "zustand";

export interface IuseChapterStore {
  unitId?: string | number | undefined;
  id?: string | undefined;
  chapterName?: string | undefined;
  chapterNumber?: number | null;
  chapterDescription?: string | undefined;
  image?: string | undefined;
  time?: string | undefined;
  points?: number | null;
}

export interface IuseChapterStoreState {
  chapterId: string | undefined;
  setChapterId: (chapterId: string) => void;
  chapters: IuseChapterStore[];
  newChapter: IuseChapterStore;
  chapterChecked: boolean;
  chapterModal: boolean;
  selectedImage: string | undefined;
  isEditable: boolean;
  filteredChapters: IuseChapterStore[];
  selectedId: string | undefined;
  selectedChapterId: string | undefined;
  openAlert: boolean;
  editableChapter: IuseChapterStore;
  addChapter: (newChapter: IuseChapterStore) => void;
  updateChapterById: (id: string, updatedChapter: IuseChapterStore) => void;
  setOpenAlert: (openAlert: boolean) => void;
  setSelectedId: (id: string | undefined) => void;
  setIsEditable: (isEditable: boolean) => void;
  setChapterModal: (modal: boolean) => void;
  setNewChapter: (newChapter: IuseChapterStore) => void;
  setChapterChecked: (chapterChecked: boolean) => void;
  setChapter: (chapters: IuseChapterStore[]) => void;
  setAllChapters: (chapters: IuseChapterStore[]) => void;
  setSelectedImage: (selectedImage: string | undefined) => void;
  setSelectedChapterId: (selectedChapterId: string) => void;
  setFilteredChapters: (filteredChapters: IuseChapterStore) => void;
  setEditableChapter: (editableChapter: IuseChapterStore) => void;
  updateEditableChapter: (
    key: string,
    value: string | number | boolean
  ) => void;
}

const useChapterStore = create<IuseChapterStoreState>((set) => ({
  chapterId: "",
  setChapterId: (chapterId) => set((state) => ({ ...state, chapterId })),
  chapters: [],
  newChapter: {},
  chapterChecked: true,
  chapterModal: false,
  isEditable: false,
  selectedId: "",
  selectedChapterId: "",
  filteredChapters: [],
  openAlert: false,
  updateChapterById: (id: string, updatedChapter: IuseChapterStore) =>
    set((state) => {
      const index = state.chapters.findIndex((u) => u.id === id);
      if (index !== -1) {
        const newChapters = [...state.chapters];
        newChapters[index] = updatedChapter;
        return { chapters: newChapters };
      }
      return state;
    }),
  addChapter: (newChapter: IuseChapterStore) =>
    set((state) => {
      return { chapters: [...state.chapters, newChapter] };
    }),
  setOpenAlert: (openAlert) => set((state) => ({ openAlert })),
  setSelectedId: (selectedId) => set((state) => ({ ...state, selectedId })),
  setSelectedChapterId: (selectedChapterId) =>
    set((state) => ({ ...state, selectedChapterId })),
  setIsEditable: (isEditable) => set((state) => ({ ...state, isEditable })),
  setNewChapter: (newChapter) => set((state) => ({ ...state, newChapter })),
  setChapterModal: (chapterModal) =>
    set((state) => ({ ...state, chapterModal })),
  setChapterChecked: (chapterChecked) =>
    set((state) => ({ ...state, chapterChecked })),
  setChapter: (chapters: IuseChapterStore[]) =>
    set((state) => {
      const updatedChapters = Array.isArray(chapters)
        ? chapters.map((chapter) => {
            const index = state.chapters.findIndex((u) => u.id === chapter.id);
            if (index === -1) {
              // if the chapter doesn't exist in the array, add it
              return chapter;
            } else {
              // if the chapter exists, update it
              //const updatedChapter = { ...state.chapters[index], ...chapter };
              return chapter;
            }
          })
        : [];
      return { chapters: updatedChapters };
    }),

  editableChapter: {} as IuseChapterStore,
  setEditableChapter: (editableChapter) =>
    set((state) => ({ ...state, editableChapter })),
  setAllChapters: (chapters: IuseChapterStore[]) => set(() => ({ chapters })),
  selectedImage: "",
  setSelectedImage: (selectedImage) =>
    set((state) => ({ ...state, selectedImage })),
  setFilteredChapters: (filteredChapter) =>
    set((state) => {
      const index = state.chapters.findIndex(
        (u) => u.id === filteredChapter.id
      );
      if (index === -1) {
        // if the chapter doesn't exist in the array, add it
        return { chapters: [...state.chapters, filteredChapter] };
      } else {
        // if the chapter exists, update it
        const updatedChapters = [...state.chapters];
        updatedChapters[index] = filteredChapter;
        return { chapters: updatedChapters };
      }
    }),
  updateEditableChapter: (key: string, value: any) =>
    set((state) => ({
      editableChapter: {
        ...state.editableChapter,
        [key]: value,
      } as IuseChapterStore,
    })),
}));

export { useChapterStore };
