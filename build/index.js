"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_1 = require("./middleware/common");
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("./routes/User"));
const Logout_1 = __importDefault(require("./routes/Logout"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerSpec_1 = __importDefault(require("./util/swaggerSpec"));
const passport_config_1 = __importDefault(require("./util/passport-config"));
const Auth_1 = __importDefault(require("./routes/Auth"));
const Login_1 = __importDefault(require("./routes/Login"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const Register_1 = __importDefault(require("./routes/Register"));
const config_1 = require("./middleware/config");
const app = (0, express_1.default)();
(0, common_1.commonMiddlewares)(app);
(0, passport_config_1.default)(passport_1.default);
app.use(passport_1.default.initialize());
app.use('/', Auth_1.default);
app.use('/admin', Admin_1.default);
app.use('/user', User_1.default);
app.use('/register', Register_1.default);
app.use('/login', (0, Login_1.default)(passport_1.default));
app.use('/logout', Logout_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec_1.default));
(0, config_1.connectDB)();
app.listen(7970, () => {
    console.log('Listening on port 7970');
});
//# sourceMappingURL=index.js.map