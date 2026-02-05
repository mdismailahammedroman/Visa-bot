export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum AuthProviderType {
  GOOGLE = "google",
  CREDENTIAL = "credential",
}
// Interface for authentication providers linked to the user

export interface IAuthProvider {
  provider: AuthProviderType;
  providerID: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum GENDER_TYPE {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PENDING = "PENDING",
}

export enum VisaStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
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

  visaStatus?: VisaStatus;
  paymentStatus?: PaymentStatus;

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
};

export type TUpdateUserProfile = {
  name: string;
  profile_picture: string;
  coverPicture: string;
  gender: GENDER_TYPE;
  mobile?: string;
  location?: string;
};
