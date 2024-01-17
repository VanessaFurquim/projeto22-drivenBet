"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = __importDefault(require("http-status"));
function errorHandlingMiddleware(error, request, response, next) {
    if (error.name === 'notFoundError') {
        return response.status(http_status_1.default.NOT_FOUND).send(error.message);
    }
    if (error.name === 'invalidIdError') {
        return response.status(http_status_1.default.UNPROCESSABLE_ENTITY).send(error.message);
    }
    console.log("error: ", error);
    return response.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
}
exports.default = errorHandlingMiddleware;
