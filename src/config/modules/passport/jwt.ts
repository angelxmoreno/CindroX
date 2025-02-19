import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import type { HonoRequest } from "hono";
import { type JwtFromRequestFunction, Strategy as JwtStrategy } from "passport-jwt";

const honoExtractor: JwtFromRequestFunction = (req: HonoRequest) => {
    const authHeaderValue = req.header("Authorization");
    if (!authHeaderValue) {
        return null;
    }
    // Split header value to extract the token.
    const parts = authHeaderValue.split("Bearer ");
    if (parts.length < 2 || !parts[1].trim()) {
        return null;
    }
    return parts[1].trim();
};

const jwtOptions = {
    jwtFromRequest: honoExtractor,
    secretOrKey: appConfig.passport.strategies.jwt.secret,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const model = AppContainer.resolve("UsersModel");
        const user = await model.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
});
