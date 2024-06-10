import express, { Request, Response, json } from "express";
import { chapterDetails } from "../models/chapterModel";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import { authMidd } from "../middelware/current-user";
import { pageDetails } from "../models/pageModel";
import { topsectionDetails } from "../models/topsectionModel";
import { bottomsectionDetails } from "../models/bottomsectionModel";
import { previewDetails } from "../models/previewModel";
//const {v4:uuidv4} = require("uuid")
const router = express.Router();
router.use(fileUpload());

router.post("/v1/chapter", async (req: Request, res: Response) => {
  try {
    const {
      unitId,
      id,
      chapterNumber,
      chapterName,
      chapterDescription,
      time,
      points,
      image,
    } = req.body;
    // Check if a unit with the same unitNumber and level already exists
    const existingUnit = await chapterDetails.findOne({ chapterNumber });
    if (existingUnit) {
      return res.status(400).send({
        status: false,
        message: "chapter Number already exists.",
      });
    }
    const imageUrl = image?.fileURL;
    let obj = {
      unitId,
      id,
      chapterNumber,
      chapterName,
      chapterDescription,
      time,
      points,
      image,
    };
    const chapters = new chapterDetails(obj);

    await chapters.save();

    return res.status(201).send({
      status: true,
      message: "chapter created successfully",
      data: chapters,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get("/v1/getchapters", authMidd, async (req: Request, res: Response) => {
  try {
    const chapter = await chapterDetails.find({ isDeleted: false });
    res.send(chapter);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/getChaptersUnit/:unitId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      const unitId = req.params.unitId;
      const chapters = await chapterDetails.find({
        unitId: unitId,
        isDeleted: false,
      });
      return res.status(200).send({
        status: true,
        message: "Chapter wrt unit retrieved successfully",
        data: chapters,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.get(
  "/v1/chapters/:chapterId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let chapterId = req.params.chapterId;
      const page = await chapterDetails.findOne({ id: chapterId });

      return res.status(200).send({
        status: true,
        message: "chapter retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);
// get points from chapter page
router.get(
  "/v1/chapterPoints/:chapterId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let chapterId = req.params.chapterId;
      const chapter = await chapterDetails.findOne({ id: chapterId });
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const page = await pageDetails.find({
        chapterId: chapterId,
        isDeleted: false,
      });
      const points = chapter.points;
      const numPages = page.length;
      return res.status(200).send({
        status: true,
        message: "chapter retrieved successfully",
        data: {
          points,
          numPages,
        },
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put("/v1/chapters/:chapterId", async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const {
      unitId,
      id,
      chapterName,
      chapterNumber,
      time,
      chapterDescription,
      points,
      image,
    } = data;
    let chapterId = req.params.chapterId;
    const existingUnit = await chapterDetails.findOne({
      chapterNumber,

      id: { $ne: chapterId }, // Exclude the current chapter being updated
    });
    if (existingUnit) {
      return res.status(400).send({
        status: false,
        message: "chapter Number already exists.",
      });
    }
    if (existingUnit) return;
    let updateBody = await chapterDetails.findOneAndUpdate(
      { id: chapterId },
      {
        $set: {
          unitId: unitId,
          chapterName: chapterName,
          chapterNumber: chapterNumber,
          time: time,
          chapterDescription: chapterDescription,
          points: points,
          image: image,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      messege: "Data updated successfully",
      data: updateBody,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});
router.delete(
  "/v1/chapters/:chapterId",
  async (req: Request, res: Response) => {
    try {
      const chapterId = req.params.chapterId;

      // Delete the associated chapter
      await chapterDetails.deleteMany({ id: chapterId });

      await pageDetails.deleteMany({ chapterId: chapterId });

      // Delete the associated top sections
      await topsectionDetails.deleteMany({ chapterId: chapterId });

      // Delete the associated bottom sections
      await bottomsectionDetails.deleteMany({ chapterId: chapterId });
      await previewDetails.deleteMany({ chapterId: chapterId });
      return res.status(200).send({
        status: true,
        message: "chapter and associated data deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

router.delete("/v1/deleteChapters", async (req, res) => {
  try {
    const result = await chapterDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} chapters`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export { router as chapterRouter };
