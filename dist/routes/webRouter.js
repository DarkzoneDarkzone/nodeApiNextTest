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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRouter = void 0;
const Auth_1 = require("./../middleware/Auth");
const UserController_1 = require("./../controllers/UserController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.get('/getall', Auth_1.Authenticate, userController.OnGetAll);
router.get('/getById/:id', Auth_1.Authenticate, userController.OnGetById);
router.post('/create', upload.single('image'), [
    (0, express_validator_1.check)('firstname').isString(),
    (0, express_validator_1.check)('lastname').isString(),
    (0, express_validator_1.check)('email').isString(),
    (0, express_validator_1.check)('password').isString(),
], userController.OnCreate);
router.post('/update', [
    (0, express_validator_1.check)('id').isString(),
    (0, express_validator_1.check)('firstname').isString(),
    (0, express_validator_1.check)('lastname').isString(),
], Auth_1.Authenticate, userController.OnUpdate);
router.post('/login', [
    (0, express_validator_1.check)('email').isString(),
    (0, express_validator_1.check)('password').isString(),
], userController.OnSignin);
router.post('/getToken', [
    (0, express_validator_1.check)('id').isString(),
    (0, express_validator_1.check)('refresh_token').isString()
], userController.OnGetAccessToken);
exports.webRouter = router;
