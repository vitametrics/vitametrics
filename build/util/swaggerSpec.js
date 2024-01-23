"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerConf_json_1 = __importDefault(require("../swaggerConf.json"));
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerConf_json_1.default);
exports.default = swaggerSpec;
//# sourceMappingURL=swaggerSpec.js.map