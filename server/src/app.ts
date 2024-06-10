import express from "express";
import cors from "cors";
import "express-async-errors"; // Do not remove, it deals with async errors in express routes
import { json } from "body-parser";

// import routes

import { adminRouter } from "./routes/admin-route";
import { moduleRouter } from "./routes/module-route";
import { unitRouter } from "./routes/unit-router";
import { chapterRouter } from "./routes/chapter-router";
import { uploadStorageRouter } from "./routes/store-file";
import { pageRouter } from "./routes/page-route";
import { topSectionRouter } from "./routes/topsection-route";
import { bottomSectionRouter } from "./routes/bottom-router";
import { previewRouter } from "./routes/preview-router";
import { studentRouter } from "./routes/student-router";
const app = express();

declare module "express-session" {
  interface SessionData {
    jwt?: string;
  }
}

app.disable("x-powered-by");
app.set("trust proxy", true); // * traffic received from ingress
app.use(json());
app.use(
  cors({
    origin: [
      "https://dev.client.domain",
      "https://dev.admin.domain",
      "https://dev.dashboard.domain",
      "https://dev.storage.domain",
      "https://staging.playalvis.com",
      "https://staging.admin.playalvis.com",
      "https://staging.dashboard.playalvis.com",
      "https://staging.storage.playalvis.com",
    ],

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(cors());
// Register Routes

app.use(adminRouter);
app.use(moduleRouter);
app.use(unitRouter);
app.use(chapterRouter);
app.use(uploadStorageRouter);
app.use(pageRouter);
app.use(topSectionRouter);
app.use(bottomSectionRouter);
app.use(studentRouter);
app.use(previewRouter);
app.all("*", (req, res) => {
  res.status(404).send("Not Found");
});

export { app };
