import dotenv from "dotenv";
dotenv.config();

interface REDIS_TYPE {
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}
interface CLOUDINARY_TYPE {
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_SECRET: string;
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
  REDIS: REDIS_TYPE;
  CLOUDINARY: CLOUDINARY_TYPE;
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
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_SECRET",
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
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    },
    CLOUDINARY: {
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
    },
  };
};

export const envVar = loadEnvVariables();
