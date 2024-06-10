import express, { Request, Response } from "express";
import { pageDetails } from "../models/pageModel";
import { authMidd } from "../middelware/current-user";
import { topsectionDetails } from "../models/topsectionModel";
import { bottomsectionDetails } from "../models/bottomsectionModel";
import { chapterDetails } from "../models/chapterModel";
import { UnitDetails } from "../models/unitModel";

const router = express.Router();

router.post("/v1/pages", async (req: Request, res: Response) => {
  try {
    const {
      hint,
      position,
      pieceMove,
      dropPieces,
      board,
      chapterId,
      unitId,
      id,
      meta,
      fenstring,
    } = req.body;
    const obj = {
      hint,
      board,
      pieceMove,
      dropPieces,
      position,
      chapterId,
      unitId,
      id,
      meta,
      fenstring,
    };

    const newUser = new pageDetails(obj);
    await newUser.save();

    return res.status(201).send({
      status: true,
      message: " creation successfully",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get("/v1/get", authMidd, async (req: Request, res: Response) => {
  try {
    const topSections = await pageDetails.find({ isDeleted: false });
    res.send(topSections);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/getChPages/:chapterId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let chapterId = req.params.chapterId;
      const page = await pageDetails.find({
        chapterId: chapterId,
        isDeleted: false,
      });

      return res.status(200).send({
        status: true,
        message: "Page retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put(
  `/v1/updateChapterPages/:chapterId`,
  async (req: Request, res: Response) => {
    try {
      const chapterId = req.params.chapterId;
      const first = parseInt(req.query.first as string, 10);
      const last = parseInt(req.query.last as string, 10);
      let start: any = {};
      let end: any = {};

      // Retrieve the pages that match the chapterId
      const pages = await pageDetails.find({ chapterId: chapterId });
      for (let i = 0; i < pages.length; i++) {
        if (i == first) {
          start[pages[i].id] = pages[i];
        } else if (i == last) {
          end[pages[i].id] = pages[i];
        }
      }

      // Swap specific fields in the start and end pages
      const startId = Object.keys(start)[0];
      const endId = Object.keys(end)[0];

      [start[startId].id, end[endId].id] = [end[endId].id, start[startId].id];
      [start[startId].position, end[endId].position] = [
        end[endId].position,
        start[startId].position,
      ];
      [start[startId].pieceMove, end[endId].pieceMove] = [
        end[endId].pieceMove,
        start[startId].pieceMove,
      ];
      [start[startId].dropPieces, end[endId].dropPieces] = [
        end[endId].dropPieces,
        start[startId].dropPieces,
      ];
      [start[startId].board.AddedBlocks, end[endId].board.AddedBlocks] = [
        end[endId].board.AddedBlocks,
        start[startId].board.AddedBlocks,
      ];
      [start[startId].hint, end[endId].hint] = [
        end[endId].hint,
        start[startId].hint,
      ];
      [start[startId].meta, end[endId].meta] = [
        end[endId].meta,
        start[startId].meta,
      ];

      // Update MongoDB documents with swapped fields
      await pageDetails.findOneAndUpdate(
        { id: startId },
        {
          $set: {
            id: start[startId].id,
            position: start[startId].position,
            pieceMove: start[startId].pieceMove,
            dropPieces: start[startId].dropPieces,
            board: start[startId].board,
            hint: start[startId].hint,
            meta: start[startId].meta,
          },
        },
        { new: true }
      );

      await pageDetails.findOneAndUpdate(
        { id: endId },
        {
          $set: {
            id: end[endId].id,
            position: end[endId].position,
            pieceMove: end[endId].pieceMove,
            dropPieces: end[endId].dropPieces,
            board: end[endId].board,
            hint: end[endId].hint,
            meta: end[endId].meta,
          },
        },
        { new: true }
      );

      const newPages = await pageDetails.find({ chapterId: chapterId });
      return res.status(200).send({
        status: true,
        message: "Data updated successfully",
        data: newPages,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.get(
  "/v1/getPages/:pageId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let pageId = req.params.pageId;
      const page = await pageDetails.findOne({ id: pageId });

      return res.status(200).send({
        status: true,
        message: "Page retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);
router.get(
  "/v1/page/:pageId/unit-chapter",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;

      // Find the page object by its ID
      const page = await pageDetails.findOne({ id: pageId });

      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      // Retrieve the unit and chapter IDs from the page object
      const { unitId, chapterId } = page;

      // Find the unit object by its ID
      const unit = await UnitDetails.findOne({ id: unitId });

      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }

      // Find the chapter object by its ID
      const chapter = await chapterDetails.findOne({ id: chapterId });

      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      return res.status(200).json({
        status: true,
        message: "Unit and Chapter retrieved successfully",
        data: {
          unit: {
            unitNumber: unit.unitNumber,
            unitName: unit.unitName,
            levels: unit.levels,
          },
          chapter: {
            chapterNumber: chapter.chapterNumber,
            chapterName: chapter.chapterName,
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
);
router.put("/v1/updatePage/:pageId", async (req: Request, res: Response) => {
  try {
    const {
      hint,
      position,
      pieceMove,
      dropPieces,
      board,
      chapterId,
      meta,
      unitId,
      fenstring,
    } = req.body;
    let pageId = req.params.pageId;
    let updateBody = await pageDetails.findOneAndUpdate(
      { id: pageId },
      {
        $set: {
          fenstring: fenstring,
          hint: hint,
          position: position,
          pieceMove: pieceMove,
          dropPieces: dropPieces,
          board: board,
          chapterId: chapterId,
          unitId: unitId,
          meta: meta,
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
  "/v1/PageTopBottom/:pageId",
  async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId;

      // Delete the associated page
      await pageDetails.deleteMany({ id: pageId });

      // Delete the associated top sections
      await topsectionDetails.deleteMany({ pageId: pageId });

      // Delete the associated bottom sections
      await bottomsectionDetails.deleteMany({ pageId: pageId });

      return res.status(200).send({
        status: true,
        message: "page and associated data deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);
// remove option from dropPieces
router.patch("/v1/removeDropPiece/:pageId", async (req, res) => {
  const pageId = req.params.pageId; // the page ID
  const { optionNumber } = req.body; // the optionNumber to remove

  try {
    // Use the $pull operator to remove the dropPiece with the specified optionNumber
    const updatedPage = await pageDetails.findOneAndUpdate(
      { pageId },
      { $pull: { dropPieces: { optionNumber } } },
      { new: true } // this option returns the updated document
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res
      .status(200)
      .json({ message: "Drop piece removed successfully", data: updatedPage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/v1/deletePages", async (req, res) => {
  try {
    const result = await pageDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} pages`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export { router as pageRouter };
