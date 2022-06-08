"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./util/config");
const webRouter_1 = require("./routes/webRouter");
/* test socket */
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, './../dist/public/')));
/*  -------- converting json -------- */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* test socket */
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*"
    }
});
/* Middleware */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RefreshToken');
    next();
});
// router
app.use('/api/', webRouter_1.webRouter);
/* test socket */
io.on("connection", (socket) => {
    console.log('connected...');
});
app.listen(config_1.serverPort);
