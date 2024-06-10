import mongoose from "mongoose";

interface Imodule {
  name: string;
  isDeleted: boolean;
}

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const moduleDetails = mongoose.model<Imodule>("Module", moduleSchema);

export { moduleDetails };
