import mongoose from "mongoose";

interface Ipreview {
  unitId?: string;
  chapterId?: string;
  preview?: Object;
  isDeleted: Boolean;
}

const previewSchema = new mongoose.Schema(
  {
    unitId: {
      type: String,
    },
    chapterId: {
      type: String,
      required: true,
    },
    preview: {
      type: Object,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const previewDetails = mongoose.model<Ipreview>("Preview", previewSchema);

export { previewDetails };
