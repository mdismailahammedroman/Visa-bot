import { SESClient } from '@aws-sdk/client-ses';
import { envVar } from './EnvVar';


export const sesClient = new SESClient({
  region: envVar.AWS.AWS_REGION,
  credentials: {
    accessKeyId: envVar.AWS.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVar.AWS.AWS_SECRET_ACCESS_KEY,
  },
});