"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: error.errors.map(err => err.message).join(", "),
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.js.map