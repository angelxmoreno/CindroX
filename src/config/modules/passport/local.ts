import AppContainer from "@config/container";
import argon2 from "argon2";
import { Strategy as LocalStrategy } from "passport-local";

export const localStrategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
        try {
            const model = AppContainer.resolve("UsersModel");
            const user = await model.findByEmail(email);
            if (!user) {
                return done(null, false, { message: "Incorrect email or password." });
            }
            const valid = await argon2.verify(user.password, password);
            if (!valid) {
                return done(null, false, { message: "Incorrect email or password." });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    },
);
