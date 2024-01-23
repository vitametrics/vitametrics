"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error destroying session:', err);
                return res.json({ success: false, message: 'Error logging out' });
            }
            return res.json({ success: false, message: 'An error occurred.' });
        }
        res.clearCookie('token');
        return res.json({ success: true, message: 'Successfully logged out' });
    });
});
exports.default = router;
//# sourceMappingURL=Logout.js.map