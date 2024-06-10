import mongoose from "mongoose";
import cors from "cors";
import express, { Request, Response } from "express";
import { authMidd } from "./middelware/current-user";

import { application } from "express";
import session, { SessionData } from "express-session";
import { app } from "./app";

declare module "express-session" {
  interface SessionData {
    jwt?: string;
  }
}

// cors to the server
app.use(cors());

app.use(cors());
const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to mongodb");

  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
};

start();
