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
const express_1 = __importDefault(require("express"));
const Invite_1 = __importDefault(require("../models/Invite"));
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
router.post('/create-invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['x-access-token'];
    const { emails } = req.body;
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!emails || !Array.isArray(emails) || emails.length == 0) {
        return res.status(400).json({ msg: 'Emails required' });
    }
    const newInviteCode = crypto_1.default.randomBytes(15).toString('hex');
    try {
        const invite = new Invite_1.default({
            code: newInviteCode,
            emails: emails.map(email => ({ email, used: false }))
        });
        yield invite.save();
        return res.json({ inviteCode: newInviteCode });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
exports.default = router;
//# sourceMappingURL=Admin.js.map