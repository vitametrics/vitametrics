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
const json2csv_1 = require("json2csv");
const User_1 = __importDefault(require("../models/User"));
const Device_1 = __importDefault(require("../models/Device"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const fetchData_1 = __importDefault(require("../util/fetchData"));
const router = express_1.default.Router();
router.post('/sync-data/:deviceId', verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const deviceId = req.params.deviceId;
        const user = yield User_1.default.findOne({ userId });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!user.fitbitAccessToken) {
            return res.status(400).json({ msg: 'User does not have a Fitbit access token' });
        }
        const device = yield Device_1.default.findOne({ userId, deviceId });
        if (!device) {
            return res.status(404).json({ msg: 'Device not found or access denied' });
        }
        try {
            yield (0, fetchData_1.default)(userId, user.fitbitAccessToken, 'day');
        }
        catch (err) {
            if (err.message === 'Token refresh failed') {
                return res.status(400).json({ msg: 'Failed to refresh Fitbit access token' });
            }
        }
        yield (0, fetchData_1.default)(userId, user.fitbitAccessToken, 'day');
        return res.status(200).json({ msg: 'Fitbit data synced successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
router.get('/download-data/:deviceId', verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const deviceId = req.params.deviceId;
        const device = yield Device_1.default.findOne({ deviceId, userId }).lean();
        if (!device) {
            return res.status(404).json({ msg: 'Device not found or access denied' });
        }
        const fields = ['deviceId', 'deviceType', 'heartRateData', 'sleepData'];
        const json2csv = new json2csv_1.Parser({ fields });
        const csvData = json2csv.parse(device);
        res.setHeader('Content-disposition', 'attachment; filename=device-data.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csvData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}));
exports.default = router;
//# sourceMappingURL=User.js.map