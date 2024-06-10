import express, { Request, Response } from "express";
import { bottomsectionDetails } from "../models/bottomsectionModel";
import { authMidd } from "../middelware/current-user";

const router = express.Router();
router.post("/v1/bottomsection", async (req: Request, res: Response) => {
  try {
    const {
      text,
      oneImage,
      twoImages,
      videos,
      mcq,
      hint,
      wrong,
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
      wrong,
      pageId,
      chapterId,
      unitId,
      id,
    };

    const bottomPage = new bottomsectionDetails(obj);

    await bottomPage.save();

    return res.status(201).send({
      status: true,
      message: "Creation successful",
      data: bottomPage,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/bottomsection",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      const bottomSections = await bottomsectionDetails.find({
        isDeleted: false,
      });
      res.send(bottomSections);
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.get(
  "/v1/bottomsection/:bottomsectionId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let bottomsectionId = req.params.bottomsectionId;
      const page = await bottomsectionDetails.findOne({ id: bottomsectionId });

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
  "/v1/bottomPagesection/:pageId",

  async (req: Request, res: Response) => {
    try {
      let pageId = req.params.pageId;
      const page = await bottomsectionDetails.find({
        pageId: pageId,
        isDeleted: false,
      });
      return res.status(200).send({
        status: true,
        message: "Retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put(
  "/v1/bottomsection/:bottomsectionId",
  async (req: Request, res: Response) => {
    try {
      const {
        text,
        oneImage,
        twoImages,
        videos,
        mcq,
        hint,
        wrong,
        pageId,
        chapterId,
        unitId,
        id,
      } = req.body;
      let bottomsectionId = req.params.bottomsectionId;
      let updatedBody = await bottomsectionDetails.findOneAndUpdate(
        {
          id: bottomsectionId,
        },
        {
          $set: {
            text: text,
            oneImage: oneImage,
            twoImages: twoImages,
            videos: videos,
            mcq: mcq,
            hint: hint,
            wrong: wrong,
            pageId: pageId,
            chapterId: chapterId,
            id: id,
            unitId: unitId,
          },
        },
        { new: true }
      );

      return res.status(200).send({
        status: true,
        messege: "Data updated successfully",
        data: updatedBody,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);
// route wrt page id
router.put(
  "/v1/bottomPagesection/:pageId",
  async (req: Request, res: Response) => {
    try {
      const {
        text,
        oneImage,
        twoImages,
        videos,
        mcq,
        hint,
        wrong,
        chapterId,
        id,
        unitId,
      } = req.body;
      let targetPageId = req.params.pageId;
      let updatedBody = await bottomsectionDetails.findOneAndUpdate(
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
            wrong: wrong,
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
        message: "Data updated successfully",
        data: updatedBody,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.delete(
  "/v1/bottomsection/:bottomsectionId",
  async (req: Request, res: Response) => {
    try {
      let bottomsectionId = req.params.bottomsectionId;

      const page = await bottomsectionDetails.findOne({ id: bottomsectionId });
      if (!page) {
        return res
          .status(400)
          .send({ status: false, message: `page not Found` });
      }
      if (page.isDeleted == false) {
        await bottomsectionDetails.findOneAndUpdate(
          { id: bottomsectionId },
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
  "/v1/bottomSectionDeleted/:pageId",
  async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId;

      const bottomSection = await bottomsectionDetails.findOne({
        pageId: pageId,
        isDeleted: false,
      });

      if (!bottomSection) {
        return res
          .status(400)
          .send({ status: false, message: "bottom section not found" });
      }

      await bottomsectionDetails.findOneAndUpdate(
        { pageId: pageId },
        { isDeleted: true, deletedAt: new Date() }
      );

      return res.status(200).send({
        status: true,
        message: "bottom section deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);
router.delete("/v1/bottomsectionDelete", async (req, res) => {
  try {
    const result = await bottomsectionDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} bottomsections`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export { router as bottomSectionRouter };
