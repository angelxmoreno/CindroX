import { jwtStrategy } from "@config/modules/passport/jwt";
import { localStrategy } from "@config/modules/passport/local"; // You can store this in your environment variables
import passport from "passport";

// Local Strategy: verifies email and password.
passport.use("local", localStrategy);

// JWT Strategy: verifies the token on protected endpoints.
passport.use("jwt", jwtStrategy);

export default passport;
