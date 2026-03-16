import dotenv from "dotenv";
dotenv.config();

interface REDIS_TYPE {
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}

interface STRIPE_TYPE {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_CURRENCY: string;
}

interface SMTP_TYPE {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM_EMAIL?: string;
  SMTP_FROM_NAME?: string;
}

interface AWS_S3_type {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;
  SNS_ANDROID_PLATFORM_ARN: string;
  SNS_IOS_PLATFORM_ARN: string;
}
interface FIREBASE_TYPE {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
}
interface GOOGLE_TYPE {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

interface APPLE_AUTH_TYPE {
  APPLE_CLIENT_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;
  APPLE_PRIVATE_KEY_PATH: string;
  APPLE_CALLBACK_URL: string;
}

interface EnvVar {
  PORT: string;
  MONGODB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION_DAYS: string;
  BCRYPT_SALT_ROUND: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  REDIS: REDIS_TYPE;
  AWS: AWS_S3_type;
  FIREBASE: FIREBASE_TYPE;
  SMTP: SMTP_TYPE;
  FIXER_API_KEY: string;
  STRIPE: STRIPE_TYPE;
  GOOGLE_AUTH: GOOGLE_TYPE;
  APPLE_AUTH: APPLE_AUTH_TYPE;
  OPENAI_API_KEY?: string;
}

const loadEnvVariables = (): EnvVar => {
  const requiredEnvVars: string[] = [
    "PORT",
    "MONGODB_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRATION_DAYS",
    "BCRYPT_SALT_ROUND",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",

    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "AWS_BUCKET_NAME",

    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",

    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL",
    "SMTP_FROM_NAME",
    "FIXER_API_KEY",

    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_CURRENCY",

    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",

    "APPLE_CLIENT_ID",
    "APPLE_TEAM_ID",
    "APPLE_KEY_ID",
    "APPLE_PRIVATE_KEY_PATH",
    "APPLE_CALLBACK_URL",

    "OPENAI_API_KEY",
  ];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`❌ Missing required environment variable: ${varName}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    MONGODB_URL: process.env.MONGODB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION_DAYS: process.env
      .JWT_REFRESH_EXPIRATION_DAYS as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    },
    AWS: {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
      AWS_REGION: process.env.AWS_REGION as string,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,
      SNS_ANDROID_PLATFORM_ARN: process.env.SNS_ANDROID_PLATFORM_ARN as string,
      SNS_IOS_PLATFORM_ARN: process.env.SNS_IOS_PLATFORM_ARN as string,
    },

    FIREBASE: {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID as string,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL as string,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY as string,
    },

    SMTP: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL as string,
      SMTP_FROM_NAME: process.env.SMTP_FROM_NAME as string,
    },
    FIXER_API_KEY: process.env.FIXER_API_KEY as string,
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
      STRIPE_CURRENCY: process.env.STRIPE_CURRENCY as string,
    },
    GOOGLE_AUTH: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    APPLE_AUTH: {
      APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID as string,
      APPLE_TEAM_ID: process.env.APPLE_TEAM_ID as string,
      APPLE_KEY_ID: process.env.APPLE_KEY_ID as string,
      APPLE_PRIVATE_KEY_PATH: process.env.APPLE_PRIVATE_KEY_PATH as string,
      APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL as string,
    },
    OPENAI_API_KEY:process.env.OPENAI_API_KEY as string,
  };
};

export const envVar = loadEnvVariables();
