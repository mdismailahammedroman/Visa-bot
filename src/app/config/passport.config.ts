/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple";

import { comparePassword } from "../helpers/passwordHelper";
import { userRepository } from "../modules/user/user.repository";
import { envVar } from "./EnvVar";
import { AuthProviderType, Role } from "../modules/user/user.interface";

/* =======================================================
   LOCAL STRATEGY
======================================================= */

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await userRepository.findByEmailWithPassword(email);

        if (!user)
          return done(null, false, {
            message: "Incorrect email or password",
          });

        if (!password || !user.password)
          return done(null, false, {
            message: "Invalid credentials",
          });

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch)
          return done(null, false, {
            message: "Incorrect email or password",
          });

        user.lastLoginAt = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

/* =======================================================
   GOOGLE STRATEGY
======================================================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: envVar.GOOGLE_AUTH.GOOGLE_CLIENT_ID,
      clientSecret: envVar.GOOGLE_AUTH.GOOGLE_CLIENT_SECRET,
      callbackURL: envVar.GOOGLE_AUTH.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email)
          return done(null, false, {
            message: "No email found from Google",
          });

        let user = await userRepository.findByEmailWithPassword(email);

        if (user && !user.is_verified)
          return done(null, false, {
            message: "User is not verified",
          });

        if (user && user.isDeleted)
          return done(null, false, {
            message: "User is deleted",
          });

        if (!user) {
          user = await userRepository.createOAuthUser({
            email,
            name: profile.displayName,
            ...(profile.photos?.[0]?.value && {
              profile_picture: profile.photos[0].value,
            }),
            role: Role.USER,
            is_verified: true,
            auth_providers: [
              {
                provider: AuthProviderType.GOOGLE,
                providerID: profile.id,
              },
            ],
          });
        } else {
          await userRepository.addAuthProvider(
            user._id.toString(),
            AuthProviderType.GOOGLE,
            profile.id,
          );
        }

        user.lastLoginAt = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

/* =======================================================
   APPLE STRATEGY
======================================================= */

passport.use(
  new AppleStrategy(
    {
      clientID: envVar.APPLE_AUTH.APPLE_CLIENT_ID, // Service ID
      teamID: envVar.APPLE_AUTH.APPLE_TEAM_ID,
      keyID: envVar.APPLE_AUTH.APPLE_KEY_ID,
      privateKeyString: envVar.APPLE_AUTH.APPLE_PRIVATE_KEY_PATH,
      callbackURL: envVar.APPLE_AUTH.APPLE_CALLBACK_URL,
      scope: ["name", "email"],
      passReqToCallback: false, // 👈 REQUIRED for TS
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      idToken: any,
      profile: any,
      done: any,
    ) => {
      try {
        // Apple unique id => idToken.sub
        const appleId = idToken?.sub || profile?.id;
        const email = profile?.email; // often only first time
        const fullName = profile?.name
          ? `${profile.name.firstName ?? ""} ${profile.name.lastName ?? ""}`.trim()
          : undefined;


        if (!appleId)
          return done(null, false, {
            message: "No Apple user id found",
          });

        let user = await userRepository.findByProvider(
          AuthProviderType.APPLE,
          appleId,
        );

        if (!user && email) {
          user = await userRepository.findByEmailWithPassword(email);
        }

        if (user && !user.is_verified)
          return done(null, false, {
            message: "User is not verified",
          });

        if (user && user.isDeleted)
          return done(null, false, {
            message: "User is deleted",
          });

        if (!user) {
          user = await userRepository.createOAuthUser({
            email,
            name: fullName ?? "Apple User",
            role: Role.USER,
            is_verified: true,
            auth_providers: [
              {
                provider: AuthProviderType.APPLE,
                providerID: appleId,
              },
            ],
          });
        } else {
          await userRepository.addAuthProvider(
            user._id.toString(),
            AuthProviderType.APPLE,
            appleId,
          );
        }

        user.lastLoginAt = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
