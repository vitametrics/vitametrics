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
const Admin_1 = __importDefault(require("../models/Admin"));
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminToken = req.headers['admin-token'];
    if (!adminToken) {
        return res.status(403).json({ msg: 'Unauthorized access' });
    }
    const storedToken = yield Admin_1.default.findOne();
    if (!storedToken || !(yield storedToken.compareToken(adminToken))) {
        return res.status(403).json({ msg: 'Unauthorized access' });
    }
    next();
    return;
});
exports.default = verifyAdmin;
//# sourceMappingURL=verifyAdmin.js.map