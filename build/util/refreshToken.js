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
const User_1 = __importDefault(require("../models/User"));
function refreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ userId });
        const refreshToken = user === null || user === void 0 ? void 0 : user.fitbitRefreshToken;
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);
        try {
            const response = yield axios_1.default.post('https://api.fitbit.com/oauth2/token', params, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;
            yield User_1.default.findOneAndUpdate({ userId }, {
                fitbitAccessToken: newAccessToken,
                fitbitRefreshToken: newRefreshToken
            }, { new: true });
            return newAccessToken;
        }
        catch (err) {
            console.error("Error refreshing access token: ", err);
            throw err;
        }
    });
}
exports.default = refreshToken;
//# sourceMappingURL=refreshToken.js.map