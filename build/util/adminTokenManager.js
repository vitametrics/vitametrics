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
exports.generateToken = exports.storeToken = exports.regenerateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = __importDefault(require("../models/Admin"));
const generateToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateToken = generateToken;
const storeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const tokenHash = yield bcryptjs_1.default.hash(token, salt);
    const existingToken = yield Admin_1.default.findOne();
    if (existingToken) {
        existingToken.tokenHash = tokenHash;
        yield existingToken.save();
    }
    else {
        yield new Admin_1.default({ tokenHash }).save();
    }
});
exports.storeToken = storeToken;
const regenerateToken = () => {
    const token = generateToken();
    storeToken(token);
    console.log(`New Admin Token: ${token}`);
};
exports.regenerateToken = regenerateToken;
setInterval(regenerateToken, 1000 * 60 * 60 * 4);
//# sourceMappingURL=adminTokenManager.js.map