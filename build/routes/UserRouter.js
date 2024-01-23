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
const api_1 = __importDefault(require("../util/api"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/newuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
    const existingUser = yield User_1.default.findOne({ userId: userId });
    if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
    }
    try {
        const apiKey = yield (0, api_1.default)(32);
        const newUser = new User_1.default({
            userId,
            apiKey,
            heart_rate: [],
            accelerometer: []
        });
        yield newUser.save();
        res.status(201).json({ apiKey });
    }
    catch (err) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
router.post('/upload', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, apiKey, heart_rate, accelerometer } = req.body;
    if (!userId || !apiKey || !heart_rate) {
        return res.status(400).json({ msg: 'Bad Request' });
    }
    try {
        const user = yield User_1.default.findOne({ apiKey: apiKey, userId: userId });
        if (!user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        user.heart_rate.push(heart_rate);
        if (accelerometer) {
            user.accelerometer.push(accelerometer);
        }
        yield user.save();
        res.status(200).json({ msg: 'Data uploaded successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
router.get('/data', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(400).json({ msg: 'Bad Request' });
    }
    try {
        const userId = req.user.userId;
        const user = yield User_1.default.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ heart_rate: user.heart_rate, accelerometer: user.accelerometer });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
exports.default = router;
//# sourceMappingURL=UserRouter.js.map