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

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  profile_picture?: string;
  coverPicture?: string;
  auth_providers: IAuthProvider[];
  fcmTokens?: string[];
  role: Role;
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
