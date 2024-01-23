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
const axios_1 = __importDefault(require("axios"));
const Device_1 = __importDefault(require("../models/Device"));
function fetchAndStoreData(userId, accessToken, deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let heartRateEndpoint = `https://api.fitbit.com/1/user/${userId}/activities/heart/date/today/1d.json?deviceId=${deviceId}`;
            let sleepEndpoint = `https://api.fitbit.com/1.2/user/${userId}/sleep/date/today.json?deviceId=${deviceId}`;
            const heartRateResponse = yield axios_1.default.get(heartRateEndpoint, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const sleepResponse = yield axios_1.default.get(sleepEndpoint, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            yield Device_1.default.findOneAndUpdate({ userId, deviceId }, {
                heartRateData: heartRateResponse.data['activities-heart'],
                sleepData: sleepResponse.data.sleep,
            }, { new: true });
        }
        catch (err) {
            console.error(`Error fetching data for device ${deviceId}: `, err);
        }
    });
}
exports.default = fetchAndStoreData;
//# sourceMappingURL=fetchData.js.map