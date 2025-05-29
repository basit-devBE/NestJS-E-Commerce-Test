"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserDto = void 0;
const zod_1 = require("zod");
exports.registerUserDto = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 6 characters long"),
    name: zod_1.z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
});
//# sourceMappingURL=auth.schema.js.map