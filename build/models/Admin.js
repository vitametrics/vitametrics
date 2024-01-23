"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adminTokenSchema = new mongoose_1.default.Schema({
    tokenHash: { type: String, required: true }
});
adminTokenSchema.methods.compareToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(token, this.tokenHash);
    });
};
const AdminToken = mongoose_1.default.model('AdminToken', adminTokenSchema);
exports.default = AdminToken;
//# sourceMappingURL=Admin.js.map