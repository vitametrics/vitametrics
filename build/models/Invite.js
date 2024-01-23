"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    used: { type: Boolean, default: false }
});
const inviteCodeSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    expirationDate: { type: Date, default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) },
    usageCount: { type: Number, default: 0, required: true },
    isActive: { type: Boolean, default: true },
    emails: [emailSchema]
}, { timestamps: true });
const InviteCode = mongoose_1.default.model('inviteCodes', inviteCodeSchema);
exports.default = InviteCode;
//# sourceMappingURL=Invite.js.map