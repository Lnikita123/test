import express, { Request, Response } from "express";
import { adminDetails } from "../models/adminModel";
import jwt from "jsonwebtoken";

const bcrypt = require("bcrypt");
const router = express.Router();

import { authMidd } from "../middelware/current-user";
const app = express();

router.post("/v1/users", async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const { user, name, phone, email, password } = data;

    if (!user || !name || !phone || !email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = new adminDetails(data);
    await newUser.save();

    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});
router.post("/v1/login", async (req: Request, res: Response) => {
  try {
    let body = req.body;
    if (Object.keys(body).length > 0) {
      let userName = req.body.email;
      let password = req.body.password;
      if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userName)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please provide a valid crediantials" });
      }
      if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) {
        return res.status(400).send({
          status: false,
          msg: "please provide valid credintials of user",
        });
      }
      let user = await adminDetails.findOne({ email: userName });

      if (!user) {
        return res.status(400).send({
          status: false,
          msg: "credintials is not correct",
        });
      }

      //Compare hashed password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ status: false, msg: "credintials is not correct" });
      }

      let token = jwt.sign(
        {
          userId: user._id,
        },
        "chessBoard",
        { expiresIn: "12hrs" }
      );
      //console.log(req.session);

      res.status(200).setHeader("x-api-key", token);
      return res.status(201).send({ status: "loggedin", token: token });
    } else {
      return res.status(400).send({ msg: "Bad Request" });
    }
  } catch (err: any) {
    return res.status(500).send({ msg: err.message });
  }
});

router.get("/v1/getusers", authMidd, async (req: Request, res: Response) => {
  try {
    const unit = await adminDetails.find();
    res.send(unit);
  } catch (error: any) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

router.delete("/v1/deleteusers", async (req, res) => {
  try {
    const result = await adminDetails.deleteMany({});
    res.send(`Deleted ${result.deletedCount} users`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
export { router as adminRouter };
