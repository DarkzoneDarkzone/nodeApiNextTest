import { Authenticate } from './../middleware/Auth';
import { UserController } from './../controllers/UserController';
import { Router } from 'express'
import { check } from 'express-validator';
import * as multerUpload from '../util/multerUpload';

const upload = multerUpload.uploadImage()
const router = Router()
const userController = new UserController()

router.post('/test/uploadImage', upload.any(), userController.OnTestUploadImage)
router.post('/test/uploadVideo', upload.any(), userController.OnTestUploadVideo)


router.get('/getAll', Authenticate, userController.OnGetAll)

router.get('/getById/:id', Authenticate, userController.OnGetById)

router.post('/create', upload.single('image'), [
    check('firstname').isString(),
    check('lastname').isString(),
    check('email').isEmail().notEmpty(),
    check('password').isString().notEmpty(),
], userController.OnCreate)

router.post('/update', [
    check('id').notEmpty(),
    check('firstname').isString(),
    check('lastname').isString(),
], Authenticate, userController.OnUpdate)

router.post('/signin', [
    check('email').isEmail().notEmpty(),
    check('password').isString().notEmpty(),
], userController.OnSignin)

router.get('/checkTokenExpire/:token', userController.OnCheckAccessToken)

router.get('/generateToken/:token', userController.OnGetAccessToken)

export const webRouter = router