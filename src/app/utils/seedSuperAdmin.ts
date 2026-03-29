import  bcrypt  from 'bcrypt';

import { envVar } from "../config/EnvVar";
import {
  AuthProviderType,
  Role,
  UserStatus,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";


export const seedSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "dev.epic.nz@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists, skipping seeding.");
      return;
    }

    const superAdminPassword = envVar.SUPER_ADMIN_PASSWORD;
    if (!superAdminPassword) {
      throw new Error("SUPER_ADMIN_PASSWORD environment variable is not set");
    }

    const hashedPassword = await bcrypt.hash(
      superAdminPassword,
      Number(envVar.BCRYPT_SALT_ROUND) || 10,
    );
    const admin = await User.create({
      email: envVar.SUPER_ADMIN_EMAIL,
      name: "Super Admin",
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      is_verified: true,
      auth_providers: [
        {
          provider: AuthProviderType.CREDENTIAL,
          providerID: envVar.SUPER_ADMIN_EMAIL,
        },
      ],
      fcmTokens: [],
    });

    console.log("✅ Admin seeded successfully!");
    console.log("Email:", admin.email);
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
    throw error;
  }
};