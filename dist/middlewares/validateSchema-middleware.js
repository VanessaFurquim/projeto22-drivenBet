"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaMiddleware = void 0;
var http_status_1 = __importDefault(require("http-status"));
function validateSchemaMiddleware(schema) {
    return function (request, response, next) {
        var validation = schema.validate(request.body);
        if (validation.error) {
            return response.status(http_status_1.default.UNPROCESSABLE_ENTITY).send({ error: validation.error.message });
        }
        ;
        next();
    };
}
exports.validateSchemaMiddleware = validateSchemaMiddleware;
