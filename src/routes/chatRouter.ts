import { ChatController } from './../controllers/ChatController';
import { Router } from 'express'
import { check } from 'express-validator';
import * as multerUpload from '../util/multerUpload';

const upload = multerUpload.uploadImage()
const router = Router()
const chatController = new ChatController()

router.post('/chat/toAdmin', chatController.SendMessageToAdmin)
router.post('/chat/toMember', chatController.SendMessageToMember)

export const chatRouter = router