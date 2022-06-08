import * as jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th';
import moment from 'moment'
import bcrypt from 'bcrypt'
import { Users } from '../models/User'
import { validationResult } from 'express-validator'
import fs from 'fs'

const sharp = require('sharp');
import * as multerUpload from '../util/multerUpload';
import path from 'path';
const upload = multerUpload.uploadImage()

export class UserController {
    OnGetAll = async(req: any, res: any) => {
        /* finding data */
        const finding = await Users.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                user: finding
            }
        })
    }

    OnGetById = async(req: any, res: any) => {
        /* finding old data */
        const finding = await Users.findOne({where:{id: req.params.id}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user is not found.'
            })
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                user: finding
            }
        })
    }

    OnCreate = async(req: any, res: any) => {
        /* validate data before */
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding email multiple */
        const finding = await Users.findOne({where:{email: req.body.email}})
        if(finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'email has been used.'
            })
        }
        /* hashed password with bcrypt */
        const hashedPWD = await bcrypt.hash(req.body.password, 10)
        /* generate access_token for user */
        const access_token = jwt.sign({
            email: req.body.email,
            at: new Date().getTime()
        }, `${Config.secretKey}`, { expiresIn: '1d' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            email: req.body.email,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)

        try {
            /* function for upload image and newname (n++) */
            let upload = "uploads"+req.file.destination.split("uploads").pop()
            let dest = req.file.destination
            var ext = path.extname(req.file.originalname);
            let originalname = path.basename(req.file.originalname, ext)
            for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                originalname = originalname.split('(')[0]
                originalname += '('+i+')'
            }
            const image = await sharp(req.file.path)
            .resize(200, 200)
            .withMetadata()
            .jpeg({ quality: 95})
            .toFile( path.resolve(req.file.destination, originalname+ext))
            .then((data: any) => {
                fs.unlink( req.file.path, (err) => {
                    console.log(err)
                })
                return upload+originalname+ext
            })
            /* end upload image */
            const user = await Users.create({
                access_token: access_token,
                refresh_token: refresh_token,
                image: image,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPWD,
            })
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }

    OnUpdate = async(req: any, res: any) => {
        /* check variable to update */
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding old data */
        const finding = await Users.findOne({where:{id: req.body.id}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'users is not found.'
            })
        }
        try {
            /* update data */
            finding.firstname = req.body.firstname
            finding.lastname = req.body.lastname
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'data was updated.'
            })
        } catch(error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }

    OnSignin = async(req: any, res: any) => {
        /* for check variable to login */
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding email, username */
        const finding = await Users.findOne({where:{email: req.body.email}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user is not found.'
            })
        }
        /* check password is correctly? */
        const isPasswordCorrect = await bcrypt.compare(req.body.password, finding.password)
        if(!isPasswordCorrect){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'password is incorrect.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                email: finding.email,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '1d' })

            finding.access_token = access_token
            finding.save()

            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'password is checked.',
                data: {
                    access_token: finding.access_token,
                    refresh_token: finding.refresh_token
                }
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }
    }

    OnSignout = async(req: any, res: any) => {
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'user was signed out.'
        })
    }

    OnGetAccessToken = async (req: any, res: any) => {
        /* validate data before */
        const errors = validationResult(req.body)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding old data */
        const finding = await Users.findOne({where:{id: req.body.id}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user is not found.'
            })
        }
        try {
            /* check refresh_token is correctly? */
            if(finding.refresh_token == req.body.refresh_token){
                /* generate new access_token */
                const access_token = jwt.sign({
                    email: finding.email,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, {expiresIn: '1d'})
                finding.access_token = access_token
                finding.save()
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'generated new access_token.',
                    data: {
                        access_token: access_token
                    }
                })
            }
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'token is invalid.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }

    }
}