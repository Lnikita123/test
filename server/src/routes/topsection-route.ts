import express, { Request, Response, json } from "express";
import { topsectionDetails } from "../models/topsectionModel";
import { authMidd } from "../middelware/current-user";

const router = express.Router();
router.post("/v1/topsection", async (req: Request, res: Response) => {
  try {
    const {
      text,
      oneImage,
      twoImages,
      videos,
      mcq,
      hint,
      pageId,
      chapterId,
      unitId,
      id,
    } = req.body;
    const obj = {
      text,
      oneImage,
      twoImages,
      videos,
      mcq,
      hint,
      pageId,
      unitId,
      chapterId,
      id,
    };

    const topPage = new topsectionDetails(obj);

    await topPage.save();

    return res.status(201).send({
      status: true,
      message: "Creation successful",
      data: topPage,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get("/v1/topsection", authMidd, async (req: Request, res: Response) => {
  try {
    const topSections = await topsectionDetails.find({ isDeleted: false });
    res.send(topSections);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/topsection/:topsectionId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let topsectionId = req.params.topsectionId;
      const page = await topsectionDetails.findOne({ id: topsectionId });

      return res.status(200).send({
        status: true,
        message: "retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);
router.get(
  "/v1/topSectionPage/:pageId",
  async (req: Request, res: Response) => {
    try {
      let pageId = req.params.pageId;
      const page = await topsectionDetails.find({
        pageId: pageId,
        isDeleted: false,
      });
      return res.status(200).send({
        status: true,
        message: "retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put(
  "/v1/topsection/:topsectionId",
  async (req: Request, res: Response) => {
    try {
      const {
        text,
        oneImage,
        twoImages,
        videos,
        mcq,
        hint,
        pageId,
        chapterId,
        unitId,
        id,
      } = req.body;
      let topsectionId = req.params.topsectionId;
      let updatedBody = await topsectionDetails.findOneAndUpdate(
        {
          id: topsectionId,
        },
        {
          $set: {
            text: text,
            oneImage: oneImage,
            twoImages: twoImages,
            videos: videos,
            mcq: mcq,
            hint: hint,
            pageId: pageId,
            chapterId: chapterId,
            unitId: unitId,
            id: id,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        messege: "data updated successfully",
        data: updatedBody,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);
// route wrt page id
router.put(
  "/v1/topPagesection/:pageId",
  async (req: Request, res: Response) => {
    try {
      const {
        text,
        oneImage,
        twoImages,
        videos,
        mcq,
        hint,
        chapterId,
        id,
        unitId,
      } = req.body;
      let targetPageId = req.params.pageId;
      let updatedBody = await topsectionDetails.findOneAndUpdate(
        {
          pageId: targetPageId,
        },
        {
          $set: {
            text: text,
            oneImage: oneImage,
            twoImages: twoImages,
            videos: videos,
            mcq: mcq,
            hint: hint,
            pageId: targetPageId,
            chapterId: chapterId,
            unitId: unitId,
            id: id,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "data updated successfully",
        data: updatedBody,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.delete(
  "/v1/topsection/:topsectionId",
  async (req: Request, res: Response) => {
    try {
      let topsectionId = req.params.topsectionId;

      const page = await topsectionDetails.findOne({ id: topsectionId });
      if (!page) {
        return res
          .status(400)
          .send({ status: false, message: `page not Found` });
      }
      if (page.isDeleted == false) {
        await topsectionDetails.findOneAndUpdate(
          { id: topsectionId },
          { $set: { isDeleted: true, deletedAt: new Date() } }
        );

        return res.status(200).send({
          status: true,
          message: `pages deleted successfully.`,
        });
      }
      return res.status(400).send({
        status: true,
        message: `pages has been already deleted.`,
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

router.delete(
  "/v1/topSectionDelete/:pageId",
  async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId;

      const topSection = await topsectionDetails.findOne({
        pageId: pageId,
        isDeleted: false,
      });

      if (!topSection) {
        return res
          .status(400)
          .send({ status: false, message: "Top section not found" });
      }

      await topsectionDetails.findOneAndUpdate(
        { pageId: pageId },
        { isDeleted: true, deletedAt: new Date() }
      );

      return res.status(200).send({
        status: true,
        message: "Top section deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

router.delete("/v1/topsectionDelete", async (req, res) => {
  try {
    const result = await topsectionDetails.deleteMany({ isDeleted: false });
    res.send(`Deleted ${result.deletedCount} topsections`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
export { router as topSectionRouter };
