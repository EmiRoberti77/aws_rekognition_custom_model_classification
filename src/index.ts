import {
  RekognitionClient,
  DetectCustomLabelsCommand,
} from "@aws-sdk/client-rekognition";
import { equineFaceArn } from "./models/equine_face";
import { fromSSO } from "@aws-sdk/credential-providers";
import fs from "fs";
import { join } from "path";

const rekClient = new RekognitionClient({
  region: "eu-west-2",
  credentials: fromSSO({ profile: "emiadmin" }),
});

const readImageAsBase64 = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString("base64");
};

const classify = async (filePath: string, modelArn: string) => {
  try {
    const imageBytes = Uint8Array.from(
      Buffer.from(readImageAsBase64(filePath), "base64")
    );
    const commnand = new DetectCustomLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      ProjectVersionArn: modelArn,
    });

    const response = await rekClient.send(commnand);
    console.log("Detected labal:", JSON.stringify(response));
  } catch (err: any) {
    console.error(err.message);
  }
};

const imagePath = join(__dirname, "..", "images", "blaze3.jpeg");
console.log(imagePath);
classify(imagePath, equineFaceArn);
