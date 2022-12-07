"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatRouter_1 = require("./routes/chatRouter");
const express_1 = __importDefault(require("express"));
const config_1 = require("./util/config");
const webRouter_1 = require("./routes/webRouter");
const path_1 = __importDefault(require("path"));
const Sockets_1 = require("./util/Sockets");
const app = (0, express_1.default)();
/*  -------- converting json -------- */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* Middleware */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// router
app.use('/api/', webRouter_1.webRouter);
app.use(chatRouter_1.chatRouter);
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist/public/')));
/* Socket Start */
const server = app.listen(config_1.socketPort);
const io = Sockets_1.SIO.init(server);
app.listen(config_1.serverPort);
