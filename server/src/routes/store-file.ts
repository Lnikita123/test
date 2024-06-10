import express from "express";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";

import { minioClient } from "../minio-init";

const router = express.Router();
router.use(fileUpload());

interface FileUpload {
  bucketName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileBuffer: Buffer;
}

router.post("/v1/storage", async (req, res) => {
  const { bucketName, fileName }: FileUpload = req.body as any;
  const { fileData } = req.files as FileArray;

  const file = fileData as UploadedFile;

  const fileBuffer = file.data;

  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName, "ap-south-1");
  }

  const metaData = {
    "Content-Type": file.mimetype,
  };

  const resp = await minioClient.putObject(
    bucketName,
    fileName,
    fileBuffer,
    metaData
  );

  const minioURL = await minioClient.presignedGetObject(

    bucketName,
    fileName,
    24 * 60 * 60
  );


  // extract path from URL
  const url = new URL(minioURL);


  const fileURL = `https://dev.storage.domain/minio${url.pathname}${url.search}`;

  res.status(201).send({
    fileURL,
    ...resp,
  });
});

export { router as uploadStorageRouter };

