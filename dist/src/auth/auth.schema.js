"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserDto = exports.verifyUserDto = exports.registerUserDto = void 0;
const zod_1 = require("zod");
exports.registerUserDto = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(255).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
    name: zod_1.z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
});
exports.verifyUserDto = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    verificationCode: zod_1.z.string().length(6, "Verification code must be exactly 6 characters long"),
});
exports.loginUserDto = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters long")
});
//# sourceMappingURL=auth.schema.js.map