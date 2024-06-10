import express, { Request, Response } from "express";
import { moduleDetails } from "../models/moduleModel";
import { authMidd } from "../middelware/current-user";

const router = express.Router();

router.post("/v1/modules", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const modules = new moduleDetails(req.body);
    await modules.save();

    return res.status(201).send({
      status: true,
      message: "modules created successfully",
      data: modules,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get("/v1/getmodule", authMidd, async (req: Request, res: Response) => {
  try {
    const module = await moduleDetails.find({ isDeleted: false });
    res.send(module);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/modules/:moduleId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      let moduleId = req.params.moduleId;
      const page = await moduleDetails.findOne({ _id: moduleId });

      return res.status(200).send({
        status: true,
        message: "module retrieved successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put("/v1/modules/:moduleId", async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const { name } = data;
    let moduleId = req.params.moduleId;
    let updateBody = await moduleDetails.findOneAndUpdate(
      { _id: moduleId },
      {
        $set: {
          name: name,
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

router.delete("/v1/modules/:moduleId", async (req: Request, res: Response) => {
  try {
    let moduleId = req.params.moduleId;

    const page = await moduleDetails.findOne({ _id: moduleId });
    if (!page) {
      return res.status(400).send({ status: false, message: `page not Found` });
    }
    if (page.isDeleted == false) {
      await moduleDetails.findOneAndUpdate(
        { _id: moduleId },
        { $set: { isDeleted: true, deletedAt: new Date() } }
      );

      return res
        .status(200)
        .send({ status: true, message: `module deleted successfully.` });
    }
    return res
      .status(400)
      .send({ status: true, message: `module has been already deleted.` });
  } catch (err: any) {
    return res.status(500).send({ msg: err.message });
  }
});

export { router as moduleRouter };
