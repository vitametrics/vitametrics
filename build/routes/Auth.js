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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const CodeVerifier_1 = __importDefault(require("../models/CodeVerifier"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get('/auth', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codeVerifier = crypto_1.default.randomBytes(32).toString('hex');
    const hash = crypto_1.default.createHash('sha256').update(codeVerifier).digest('base64');
    const codeChallenge = hash.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    try {
        yield new CodeVerifier_1.default({ value: codeVerifier }).save();
        const authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${process.env.FITBIT_CLIENT_ID}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight%20profile&redirect_uri=${process.env.REDIRECT_URI}`;
        res.redirect(authUrl);
    }
    catch (err) {
        res.status(500).send('Internal Server Error');
    }
}));
router.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = req.query.code;
    try {
        const verifier = yield CodeVerifier_1.default.findOne().sort({ createdAt: -1 }).limit(1);
        const codeVerifier = verifier === null || verifier === void 0 ? void 0 : verifier.value;
        yield CodeVerifier_1.default.findOneAndDelete(verifier === null || verifier === void 0 ? void 0 : verifier._id);
        const params = new URLSearchParams();
        params.append('client_id', process.env.FITBIT_CLIENT_ID);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env.REDIRECT_URI);
        params.append('code_verifier', codeVerifier);
        const tokenResponse = yield axios_1.default.post('https://api.fitbit.com/oauth2/token', params, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const accessToken = tokenResponse.data.access_token;
        const profileResponse = yield axios_1.default.get('https://api.fitbit.com/1/user/-/profile.json', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const fitbitUserID = profileResponse.data.user.encodedId;
        const refreshToken = tokenResponse.data.refresh_token;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(403).send('Unauthorized access - No token');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userEmail = decodedToken.email;
        yield User_1.default.findOneAndUpdate({ email: userEmail }, {
            userId: fitbitUserID,
            fitbitAccessToken: accessToken,
            fitbitRefreshToken: refreshToken,
            languageLocale: profileResponse.data.user.languageLocale,
            distanceUnit: profileResponse.data.user.distanceUnit,
        }, { upsert: true, new: true });
        res.redirect('/dashboard');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    return;
}));
exports.default = router;
//# sourceMappingURL=Auth.js.map