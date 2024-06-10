import express, { Request, Response } from "express";
import { studentDetails } from "../models/studentModel";
import { authMidd } from "../middelware/current-user";
import jwt from "jsonwebtoken";
import { chapterDetails } from "../models/chapterModel";
//import bcrypt from "bcrypt";
const router = express.Router();

// import { authMidd } from "../middelware/current-student";
const app = express();

router.post("/v1/student", async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const { email, uid, password, Progress, name, avatar } = data;

    const newstudent = new studentDetails({
      email,
      uid,
      password,
      Progress,
      name,
      avatar,
    });
    await newstudent.save();

    return res.status(201).send({
      status: true,
      message: "student created successfully",
      data: newstudent,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.put("/v1/student/:studentId", async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    let studentId = req.params.studentId;
    let updateBody = await studentDetails.findOneAndUpdate(
      { id: studentId },
      {
        $set: {
          avatar: avatar,
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

router.post("/v1/students/login", async (req: Request, res: Response) => {
  try {
    let body = req.body;
    if (Object.keys(body).length > 0) {
      let email = req.body.email;
      //let password = req.body.password;
      if (!email) {
        return res
          .status(400)
          .send({ status: false, msg: "Please provide valid credentials" });
      }
      // if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) {
      //   return res.status(400).send({
      //     status: false,
      //     msg: "Please provide valid credentials",
      //   });
      // }
      let student = await studentDetails.findOne({ email: email });
      if (!student) {
        return res.status(400).send({
          status: false,
          msg: "Credentials are not correct",
        });
      }

      // Compare hashed password using bcrypt
      // const isMatch = await bcrypt.compare(password, student.password);
      // if (!isMatch) {
      //   return res
      //     .status(400)
      //     .send({ status: false, msg: "Credentials are not correct" });
      // }

      let token = jwt.sign(
        {
          studentId: student.id,
        },
        "chessBoard",
        { expiresIn: "12hrs" }
      );

      res.status(200).setHeader("x-api-key", token);
      return res.status(201).send({
        status: "loggedin",
        token: token,
        id: student.id,
        email: student.email,
      });
    } else {
      return res.status(400).send({ msg: "Bad Request" });
    }
  } catch (err: any) {
    return res.status(500).send({ msg: err.message });
  }
});
router.get("/v1/getstudent", authMidd, async (req: Request, res: Response) => {
  try {
    const user = await studentDetails.find();
    res.send(user);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});
router.get(
  "/v1/student/:studentId",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      const student = await studentDetails.findOne({ id: studentId });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json({
        status: true,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.put(
  "/v1/student/:studentId/:unitId/:chapterId/:pageId/progress",
  async (req: Request, res: Response) => {
    try {
      const { studentId, unitId, chapterId, pageId } = req.params;
      const { points } = req.body;

      // Retrieve the student
      const student = await studentDetails.findOne({ id: studentId });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Retrieve the chapter object by its ID
      const chapter = await chapterDetails.findOne({ id: chapterId });

      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      // Update page progress using MongoDB's dot notation
      const updateQuery: { [key: string]: any } = {};
      const progressPath = `Progress.${unitId}.${chapterId}.${pageId}`;
      if (!student.Progress[unitId]?.[chapterId]?.[pageId]) {
        updateQuery[progressPath] = points;
      }

      const updatedStudent = await studentDetails.findOneAndUpdate(
        { id: studentId },
        { $set: updateQuery },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "Page progress updated successfully",
        data: updatedStudent,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
);

router.get("/v1/dropIndex", authMidd, async (req: Request, res: Response) => {
  try {
    const indexes = await studentDetails.collection.getIndexes();
    const nameIndexName = indexes["name"]; // Replace 'name_1' with the actual index name

    if (nameIndexName) {
      await studentDetails.collection.dropIndex(nameIndexName);
      res.send({ status: true, message: "Index dropped successfully." });
    } else {
      res.send({
        status: true,
        message: "Index for name field does not exist.",
      });
    }
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.get(
  "/v1/checkIndexes",
  authMidd,
  async (req: Request, res: Response) => {
    try {
      const indexes = await studentDetails.collection.getIndexes();
      const fieldNames = Object.entries(indexes)
        .filter(([indexName, indexValue]) => indexName !== "_id_") // Exclude the default _id_ index
        .map(([indexName, indexValue]) => indexValue[0][0]);
      res.send({ status: true, data: fieldNames });
    } catch (error: any) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
);

router.delete("/v1/deleteAllStudents", async (req, res) => {
  try {
    const result = await studentDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} students`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
export { router as studentRouter };
