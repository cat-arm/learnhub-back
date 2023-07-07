"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashPassword(password) {
    const salt = bcryptjs_1.default.genSaltSync(12);
    return bcryptjs_1.default.hashSync(password, salt);
}
exports.hashPassword = hashPassword;
function compareHash(password, hashed) {
    return bcryptjs_1.default.compareSync(password, hashed);
}
exports.compareHash = compareHash;
//# sourceMappingURL=bcrypt.js.map