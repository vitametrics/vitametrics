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
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passportConfig = (passport) => {
    const router = express_1.default.Router();
    router.use(express_1.default.json());
    passport.use(new passport_local_1.Strategy({ usernameField: 'email' }, (login, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = null;
            if (login.includes('@')) {
                user = yield User_1.default.findOne({ email: login });
            }
            else {
                return done(null, false, { message: 'Invalid credentials' });
            }
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user);
        }
        catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
            return done(err);
        }
        ;
    })));
    return router;
};
exports.default = passportConfig;
//# sourceMappingURL=passport-config.js.map