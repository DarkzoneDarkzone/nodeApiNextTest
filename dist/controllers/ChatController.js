"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
require("moment/locale/th");
const Sockets_1 = require("../util/Sockets");
class ChatController {
    constructor() {
        this.SendMessageToAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const message = req.body.message;
            Sockets_1.SIO.getIO().emit("admin1", { role: 'member', message: message });
            return res.json();
        });
        this.SendMessageToMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const message = req.body.message;
            Sockets_1.SIO.getIO().emit("admin1", { role: 'admin', message: message });
            return res.json();
        });
    }
}
exports.ChatController = ChatController;
