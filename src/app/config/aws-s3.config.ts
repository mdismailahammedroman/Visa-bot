// aws-s3.config.ts
import { envVar } from "./EnvVar";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: envVar.AWS.AWS_REGION,
  credentials: {
    accessKeyId: envVar.AWS.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVar.AWS.AWS_SECRET_ACCESS_KEY,
  },
});
