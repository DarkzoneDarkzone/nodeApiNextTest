import { Authenticate } from './../middleware/Auth';
import { UserController } from './../controllers/UserController';
import { Router } from 'express'
import { Users } from '../models/User'
import { check } from 'express-validator';
import * as multerUpload from '../util/multerUpload';


const upload = multerUpload.uploadImage()

const router = Router()
const userController = new UserController()

router.get('/getall', userController.OnGetAll)

router.get('/getById/:id', Authenticate, userController.OnGetById)

router.post('/create', upload.single('image'), [
    check('firstname').isString(),
    check('lastname').isString(),
    check('email').isEmail().notEmpty(),
    check('password').isString().notEmpty(),
], userController.OnCreate)

router.post('/update', [
    check('id').isString().notEmpty(),
    check('firstname').isString(),
    check('lastname').isString(),
], Authenticate, userController.OnUpdate)

router.post('/login', [
    check('email').isEmail().notEmpty(),
    check('password').isString().notEmpty(),
], userController.OnSignin)

// router.post('/getToken', [
//     check('id').isString(),
//     check('refresh_token').isString()
// ], userController.OnGetAccessToken)

export const webRouter = router