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
const fetchDevices_1 = __importDefault(require("../util/fetchDevices"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginRoute = (passport) => {
    const router = express_1.default.Router();
    router.post('/', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info);
            }
            let userId = user.userId || user.inviteCode;
            jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ msg: 'Internal Server Error' });
                }
                if (user.fitbitAccessToken) {
                    try {
                        yield (0, fetchDevices_1.default)(user.userId, user.fitbitAccessToken);
                    }
                    catch (err) {
                        console.error("Error fetching devices: ", err);
                        return res.status(500).json({ msg: 'Error fetching devices' });
                    }
                }
                else {
                    console.log('Fitbit OAuth2 token not available for user');
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000
                });
                return res.json({
                    token,
                    user: {
                        id: user.userId,
                        email: user.email,
                    },
                    msg: 'Logged in successfully'
                });
            }));
        })(req, res, next);
    });
    return router;
};
exports.default = loginRoute;
//# sourceMappingURL=Login.js.map