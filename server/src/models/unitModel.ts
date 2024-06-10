import mongoose from "mongoose";
interface IUnit {
  id: string;
  unitName: string;
  unitNumber: Number;
  isPublished: boolean;
  isDeleted: boolean;
  levels: string;
}

const unitSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    unitName: {
      type: String,
      required: true,
    },
    unitNumber: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    levels: {
      type: String,
      default: "beginner",
    },
  },
  { timestamps: true }
);

const UnitDetails = mongoose.model<IUnit>("Unit", unitSchema);

export { UnitDetails };
