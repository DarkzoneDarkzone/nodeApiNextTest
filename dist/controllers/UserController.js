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
exports.UserController = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const Config = __importStar(require("../util/config"));
require("moment/locale/th");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const express_validator_1 = require("express-validator");
class UserController {
    constructor() {
        this.OnGetAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield User_1.Users.findAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: {
                    user: finding
                }
            });
        });
        this.OnGetById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield User_1.Users.findOne({ where: { id: req.params.id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'user is not found.'
                });
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: {
                    user: finding
                }
            });
        });
        this.OnCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            const finding = yield User_1.Users.findOne({ where: { email: req.body.email } });
            if (finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'email has been used.'
                });
            }
            const hashedPWD = yield bcrypt_1.default.hash(req.body.password, 10);
            const access_token = jwt.sign({
                email: req.body.email,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '15' });
            const refresh_token = jwt.sign({
                email: req.body.email,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`);
            try {
                const user = yield User_1.Users.create({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hashedPWD,
                });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnUpdate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            const finding = yield User_1.Users.findOne({ where: { id: req.body.id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'users is not found.'
                });
            }
            try {
                finding.firstname = req.body.firstname;
                finding.lastname = req.body.lastname;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'data was updated.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnSignin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            const finding = yield User_1.Users.findOne({ where: { email: req.body.email } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'user is not found.'
                });
            }
            const isPasswordCorrect = yield bcrypt_1.default.compare(req.body.password, finding.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password is incorrect.'
                });
            }
            try {
                const access_token = jwt.sign({
                    email: finding.email,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '15' });
                finding.access_token = access_token;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'password is checked.',
                    data: {
                        access_token: finding.access_token,
                        refresh_token: finding.refresh_token
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'Something went wrong.'
                });
            }
        });
        this.OnSignout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'user was signed out.'
            });
        });
        this.OnGetAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            const finding = yield User_1.Users.findOne({ where: { id: req.body.id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'user is not found.'
                });
            }
            try {
                if (finding.refresh_token == req.body.refresh_token) {
                    const access_token = jwt.sign({
                        email: finding.email,
                        at: new Date().getTime()
                    }, `${Config.secretKey}`, { expiresIn: '15' });
                    finding.access_token = access_token;
                    finding.save();
                    return res.status(200).json({
                        status: true,
                        message: 'ok',
                        description: 'generated new access_token.',
                        data: {
                            access_token: access_token
                        }
                    });
                }
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'token is invalid.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'Something went wrong.'
                });
            }
        });
    }
}
exports.UserController = UserController;
