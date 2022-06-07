import { Authenticate } from './../middleware/Auth';
import { UserController } from './../controllers/UserController';
import { Router } from 'express'
import { Users } from '../models/User'
import { check } from 'express-validator';
import * as multerUpload from '../util/multerUpload';


const upload = multerUpload.uploadImage()

const router = Router()
const userController = new UserController()

router.get('/getall', Authenticate, userController.OnGetAll)

router.get('/getById/:id', Authenticate, userController.OnGetById)

router.post('/create', upload.single('image'), [
    check('firstname').isString(),
    check('lastname').isString(),
    check('email').isString(),
    check('password').isString(),
], userController.OnCreate)

router.post('/update', [
    check('id').isString(),
    check('firstname').isString(),
    check('lastname').isString(),
], Authenticate, userController.OnUpdate)

router.post('/login', [
    check('email').isString(),
    check('password').isString(),
], userController.OnSignin)

router.post('/getToken', [
    check('id').isString(),
    check('refresh_token').isString()
], userController.OnGetAccessToken)

export const webRouter = router