"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Authenticate = void 0;
const Config = __importStar(require("../util/config"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
require("moment/locale/th");
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: 'Not Authenticated.'
        });
    }
    /* receive bearer token from header */
    const token = authHeader.split(' ')[1];
    let decodedToken;
    /* if having token */
    if (token != null) {
        try {
            /* verify token for get data and check expire token */
            decodedToken = yield jwt.verify(token, `${Config.secretKey}`);
            /* if token was expired */
            if ((0, moment_1.default)().unix() > decodedToken.exp) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'token was expired.'
                });
            }
            /* data keep for use when update data in database */
            req.authToken = token;
            next();
        }
        catch (error) {
            return res.status(401).json({
                status: false,
                message: 'error',
                description: "authentication failed, token was expired!"
            });
        }
    }
    /* if don't have correct token */
    if (!decodedToken) {
        return res.status(401).json({
            status: false,
            message: 'error',
            description: "Invalid credentials"
        });
    }
});
exports.Authenticate = Authenticate;
