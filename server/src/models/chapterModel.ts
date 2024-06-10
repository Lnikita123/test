import mongoose from "mongoose";
interface IChapter {
  unitId: string;
  id: string;
  chapterName: string;
  chapterNumber: number;
  chapterDescription: string;
  time: string;
  image: any;
  points: number;
  isDeleted?: boolean;
}

const chapterSchema = new mongoose.Schema(
  {
    unitId: {
      type: String,
      // required: true,
    },
    id: {
      type: String,
    },
    chapterNumber: {
      type: Number,
      unique: true,
    },
    chapterName: {
      type: String,
    },

    chapterDescription: {
      type: String,
    },
    time: {
      type: String,
    },
    image: {
      type: String,
    },
    points: {
      type: Number,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const chapterDetails = mongoose.model<IChapter>("chapter", chapterSchema);

export { chapterDetails };
