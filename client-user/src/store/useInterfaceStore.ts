export interface IuseUnitStore {
  id: string;
  unitName?: string;
  unitNumber?: number;
  isPublished?: boolean;
  levels?: string;
}
export interface IProgressUnitStore extends IuseUnitStore {
  accuracy: number;
  effectiveLearning: string;
  rank: string;
}
export interface IuseChapterStore {
  unitId: string;
  id: string;
  chapterName?: string;
  chapterNumber?: number;
  chapterDescription?: string;
  image?: string;
  time?: string;
  points?: number;
}
export interface IChapterProgress {
  [pageId: string]: number;
}

export interface IUnitProgress {
  [chapterId: string]: IChapterProgress;
}

export interface IStudentData {
  [unitId: string]: IUnitProgress;
}

export interface IStudent {
  id: string;
  email: string;
  uid: string;
  password: string;
  name: string;
  Progress: IStudentData;
  [key: string]: any;
}
