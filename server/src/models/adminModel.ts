import mongoose from "mongoose";

interface IUser {
  user: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      enum: ["Admin", "User"],
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const adminDetails = mongoose.model<IUser>("User", userSchema);

export { adminDetails };
