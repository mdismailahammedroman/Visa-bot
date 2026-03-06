export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
}

export enum AuthProviderType {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  CREDENTIAL = "credential",
}
// Interface for authentication providers linked to the user

export interface IAuthProvider {
  provider: AuthProviderType;
  providerID: string;
}

export enum Role {
  ADMIN = "ADMIN",
  MAIN_MANAGER = "MAIN_MANAGER",
  MANAGER = "MANAGER",
  USER = "USER",
}

export enum GENDER_TYPE {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// User location coordinates
export interface ICoord {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  placeName?: string;
  lat?: number; // Latitude (for backward compatibility)
  long?: number; // Longitude (for backward compatibility)
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;

  status: UserStatus;
  role: Role;
  gender?: GENDER_TYPE;

  mobile?: string;
  location?: string;

  profile_picture?: string;
  coverPicture?: string;
  coordinate: ICoord;

  lastLoginAt?: Date;

  auth_providers: IAuthProvider[];
  fcmTokens?: string[];

  is_verified: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  fcmToken?: string;
};

export type TUpdateUserProfile = {
  name?: string;
  profile_picture?: string;
  password?: string;
  isDeleted?: boolean;
  coverPicture?: string;
  gender?: GENDER_TYPE;
  mobile?: string;

  location?: string;
  lastLoginAt?: Date;
  status?: UserStatus;
  role?: Role;
};
