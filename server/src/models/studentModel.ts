import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface IChapterProgress {
  [pageId: string]: number;
}

interface IUnitProgress {
  [chapterId: string]: IChapterProgress;
}

interface IStudent extends Document {
  id: string;
  email: string;
  uid: string;
  password: string;
  name: string;
  avatar: string;
  Progress: {
    [unitId: string]: IUnitProgress;
  };
}

const studentSchema: Schema<IStudent> = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidV4(),
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  uid: {
    type: String,
  },
  name: {
    type: String,
    unique: false,
    required: false,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
  },
  Progress: {
    type: Map,
    of: Map,
    default: {},
  },
});

const studentDetails = mongoose.model<IStudent>("Student", studentSchema);

export { studentDetails };
