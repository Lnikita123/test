import express, { Request, Response } from "express";
import { previewDetails } from "../models/previewModel";
import { authMidd } from "../middelware/current-user";
import { pageDetails } from "../models/pageModel";

const router = express.Router();
// generating preview
router.post(
  "/v1/preview/:unitId/:chapterId/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { unitId, chapterId, pageId } = req.params;
      const { preview } = req.body;

      // Find the page
      const page = await pageDetails.findOne({
        id: pageId,
        chapterId: chapterId,
        unitId: unitId,
        isDeleted: false,
      });

      // If the page doesn't exist, send an error
      if (!page) {
        return res.status(400).send({
          status: false,
          message: "Page not found",
        });
      }

      // Find the existing document
      let previewdata: any = await previewDetails.findOne({
        chapterId: chapterId,
        unitId: unitId,
      });

      if (previewdata) {
        const prevData = { ...previewdata.preview }; // Destructure the existing preview data

        // Update existing pageId with the new preview
        // or Add a new pageId:preview pair to the existing document
        prevData[pageId] = preview;

        previewdata.preview = prevData;
        await previewdata.save();
        const data = await previewDetails.find({ isDeleted: false });
        return res.status(200).send({
          status: true,
          message: "Preview updated successfully",
          data: data,
        });
      } else {
        // If the document doesn't exist, create a new one
        const newPreviewData = { [pageId]: preview };
        previewdata = new previewDetails({
          preview: newPreviewData,
          chapterId,
          unitId,
        });
        await previewdata.save();
        const data = await previewDetails.find({ isDeleted: false });
        return res.status(201).send({
          status: true,
          message: "Preview created successfully",
          data: data,
        });
      }
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.get("/v1/getpreview", async (req: Request, res: Response) => {
  try {
    const data = await previewDetails.find({ isDeleted: false });
    res.send(data);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});
router.get(
  "/v1/preview/:chapterId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let chapterId = req.params.chapterId;
      const page = await previewDetails.findOne({ chapterId: chapterId });

      return res.status(200).send({
        status: true,
        message: "preview retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.delete("/v1/deletePreview", async (req, res) => {
  try {
    const result = await previewDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} pages`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.delete(
  "/v1/deletePreview/:chapterId/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { chapterId, pageId } = req.params;

      let previewdata: any = await previewDetails.findOne({
        chapterId: chapterId,
      });
      if (!previewdata) {
        return res
          .status(400)
          .send({ status: false, message: "preview not found" });
      }
      if (previewdata.preview.hasOwnProperty(pageId)) {
        delete previewdata.preview[pageId];

        if (Object.keys(previewdata.preview).length === 0) {
          await previewDetails.deleteOne({ _id: previewdata._id });
        } else {
          await previewDetails.updateOne(
            { _id: previewdata._id },
            { $unset: { [`preview.${pageId}`]: "" } }
          );
        }
      }

      const updatedPreview = await previewDetails.findOne({
        chapterId: previewdata.chapterId,
      });

      return res.status(200).send({
        status: true,
        message: "preview deleted successfully",
        data: updatedPreview,
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);
router.delete(
  "/v1/deletePreviewCh/:chapterId",
  async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;

      let result = await previewDetails.deleteMany({ chapterId: chapterId });

      if (result.deletedCount === 0) {
        return res.status(400).send({
          status: false,
          message: "No previews found for this chapterId",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Previews deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

export { router as previewRouter };
