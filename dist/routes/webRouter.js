"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRouter = void 0;
const Auth_1 = require("./../middleware/Auth");
const UserController_1 = require("./../controllers/UserController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.get('/getall', Auth_1.Authenticate, userController.OnGetAll);
router.get('/getById/:id', Auth_1.Authenticate, userController.OnGetById);
router.post('/create', [
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
