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
function fetchAndStoreDevices(userId, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const deviceResponse = yield axios_1.default.get(`https://api.fitbit.com/1/user/${userId}/devices.json`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        for (const deviceData of deviceResponse.data) {
            yield Device_1.default.findOneAndUpdate({ deviceId: deviceData.id, userId: userId }, {
                deviceType: deviceData.type,
                userFullName: 'N/A'
            }, { upsert: true, new: true });
        }
    });
}
exports.default = fetchAndStoreDevices;
//# sourceMappingURL=fetchDevices.js.map