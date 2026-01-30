import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "../helpers/passwordHelper";
import { userRepository } from "../modules/user/user.repository";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await userRepository.findByEmailWithPassword(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        if (!password || !user.password) {
          return done(null, false, { message: "Password is missing" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
