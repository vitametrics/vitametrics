"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const userSchema = new mongoose_1.default.Schema({
    userId: String,
    email: String,
    password: String,
    fitbitAccessToken: String,
    languageLocale: String,
    distanceUnit: String,
    inviteCode: String
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map