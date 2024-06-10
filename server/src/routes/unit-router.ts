import express, { Request, Response } from "express";
import { UnitDetails } from "../models/unitModel";
import { authMidd } from "../middelware/current-user";
import { chapterDetails } from "../models/chapterModel";
import { pageDetails } from "../models/pageModel";
import { topsectionDetails } from "../models/topsectionModel";
import { bottomsectionDetails } from "../models/bottomsectionModel";
import { previewDetails } from "../models/previewModel";
const router = express.Router();

router.post("/v1/units", async (req: Request, res: Response) => {
  try {
    const { unitName, unitNumber, isPublished, id, levels } = req.body;

    // Check if a unit with the same unitNumber and level already exists
    const existingUnit = await UnitDetails.findOne({ unitNumber, levels });
    if (existingUnit) {
      return res.status(400).send({
        status: false,
        message: "A unit with this unitNumber and level already exists.",
      });
    }

    // Create a new unit document with a UUID for the id field
    const newUnit = new UnitDetails({
      id,
      unitName,
      unitNumber,
      isPublished,
      levels,
    });

    const savedUnit = await newUnit.save();

    // Return the saved unit document as the response
    return res.status(201).send({
      status: true,
      message: "Units created successfully",
      data: savedUnit,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Server error" });
  }
});

router.get("/v1/getunits", authMidd, async (req: Request, res: Response) => {
  try {
    const unit = await UnitDetails.find({ isDeleted: false });
    res.send(unit);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/units/:unitId",
  authMidd,

  async (req: Request, res: Response) => {
    try {
      let unitId = req.params.unitId;
      const units = await UnitDetails.findOne({ id: unitId });

      return res.status(200).send({
        status: true,
        message: "unit retrieved successfully",
        data: units,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put("/v1/units/:unitId", async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const { unitName, unitNumber, isPublished, levels } = data;
    let unitId = req.params.unitId;

    // Check if another unit with the same unitNumber and level already exists
    const existingUnit = await UnitDetails.findOne({
      unitNumber,
      levels,
      id: { $ne: unitId }, // Exclude the current unit being updated
    });

    if (existingUnit) {
      return res.status(400).send({
        status: false,
        message: "A unit with this unitNumber and level already exists.",
      });
    }
    if (existingUnit) return;
    let updateBody = await UnitDetails.findOneAndUpdate(
      { id: unitId },
      {
        $set: {
          unitName: unitName,
          unitNumber: unitNumber,
          isPublished: isPublished,
          levels: levels,
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
  "/v1/deleteUnitsId/:unitId",
  async (req: Request, res: Response) => {
    try {
      const unitId = req.params.unitId;

      // Delete the unit
      await UnitDetails.deleteMany({ id: unitId });

      await chapterDetails.deleteMany({ unitId: unitId });

      // Delete the associated pages
      await pageDetails.deleteMany({ unitId: unitId });

      // Delete the associated top sections
      await topsectionDetails.deleteMany({ unitId: unitId });

      // Delete the associated bottom sections
      await bottomsectionDetails.deleteMany({ unitId: unitId });
      await previewDetails.deleteMany({ unitId: unitId });
      return res.status(200).send({
        status: true,
        message: "Unit and associated data deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

router.delete("/v1/deleteunits", async (req, res) => {
  try {
    const result = await UnitDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} units`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
export { router as unitRouter };
