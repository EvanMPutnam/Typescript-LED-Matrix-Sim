import { UploaderClient } from "../client/uploaderClient"
import { X_DIM_PIXELS, Y_DIM_PIXELS } from "../constant/common";
import fs from "fs"
import { logger } from "../constant/logger";

const MAX_FAILURES = 5;
const UPLOAD_DELAY_MS = 10000

const fetchImages = (path: string) => {
  const images = fs.readdirSync(path).filter((value) => 
    value.endsWith(".png") || 
    value.endsWith(".jpg") || 
    value.endsWith(".jpeg"));
  const shuffledImages = images
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  return shuffledImages
}

const uploadFiles = async (client: UploaderClient, imagePaths: string[], rootPath: string) => {
  for (const imagePath of imagePaths) {
    logger.info(`Uploading: ${imagePath}`)
    const result = await client.uploadImage(rootPath + "/" + imagePath);
    if (!result) {
      throw new Error("Failed to upload");
    }
    await new Promise(f => setTimeout(f, UPLOAD_DELAY_MS));
  }
}

const uploadFileLoop = async (imageDirectoryPath: string) => {
  let failures = 0;
  const imagePaths = fetchImages(imageDirectoryPath)
  const client = new UploaderClient(X_DIM_PIXELS, Y_DIM_PIXELS, 8080);
  while (failures < MAX_FAILURES) {
    try {
      await uploadFiles(client, imagePaths, imageDirectoryPath);
    } catch (error: unknown) {
      failures += 1;
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }
  }
}

uploadFileLoop("./images");