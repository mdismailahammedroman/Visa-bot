import * as AWS from "aws-sdk";
import { envVar } from "./EnvVar";

export const s3Config = new AWS.S3({
  accessKeyId: envVar.aws_S3.AWS_ACCESS_KEY_ID,
  secretAccessKey: envVar.aws_S3.AWS_SECRET_ACCESS_KEY,
  region: envVar.aws_S3.AWS_REGION,
});
