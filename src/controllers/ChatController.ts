import 'moment/locale/th'
import moment from 'moment'
import * as jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import * as Config from '../util/config'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { SIO } from '../util/Sockets'

export class ChatController {
    SendMessageToAdmin = async(req: any, res: any) => {
        const message = req.body.message
        SIO.getIO().emit("admin1", {role: 'member', message: message})
        return res.json()
    }
    SendMessageToMember = async(req: any, res: any) => {
        const message = req.body.message
        SIO.getIO().emit("admin1", {role: 'admin', message: message})
        return res.json()
    }
}