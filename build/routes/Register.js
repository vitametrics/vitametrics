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
const User_1 = __importDefault(require("../models/User"));
const Invite_1 = __importDefault(require("../models/Invite"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, inviteCode } = req.body;
    console.log(email, password, inviteCode);
    if (!email || !password || !inviteCode) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = yield User_1.default.findOne({ email });
        if (user) {
            if (user.email == email.toString()) {
                return res.status(400).json({ msg: 'User already exists' });
            }
        }
        const validInviteCode = yield Invite_1.default.findOne({ code: inviteCode });
        if (!validInviteCode) {
            return res.status(400).json({ msg: 'Invalid invite code' });
        }
        if (!validInviteCode.isActive) {
            return res.status(400).json({ msg: 'Invite code is no longer valid' });
        }
        else if (!validInviteCode.emails.some(inviteObj => inviteObj.email === email)) {
            return res.status(400).json({ msg: 'Invalid invite code' });
        }
        else if ((_a = validInviteCode.emails.find(e => e.email === email)) === null || _a === void 0 ? void 0 : _a.used) {
            return res.status(400).json({ msg: 'Invite code has already been used for this email' });
        }
        const newUser = new User_1.default({
            userId: '',
            email: email,
            password: '',
            fitbitAccessToken: '',
            languageLocale: 'en-US',
            distanceUnit: 'en-US'
        });
        validInviteCode.usageCount += 1;
        validInviteCode.isActive = false;
        validInviteCode.emails.find(e => e.email === email).used = true;
        yield validInviteCode.save();
        bcryptjs_1.default.genSalt(10, (err, salt) => {
            if (err)
                throw err;
            bcryptjs_1.default.hash(password, salt, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw err;
                newUser.password = hash;
                yield newUser.save()
                    .then(user => {
                    jsonwebtoken_1.default.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                        if (err)
                            throw err;
                        res.json({
                            token,
                            user: {
                                id: user.userId,
                                email: user.email,
                                languageLocale: user.languageLocale,
                                distanceUnit: user.distanceUnit
                            }
                        });
                    });
                });
            }));
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
    return;
}));
exports.default = router;
//# sourceMappingURL=Register.js.map