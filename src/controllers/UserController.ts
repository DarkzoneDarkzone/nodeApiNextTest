import { Users } from './../models/User';
import * as jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import fs from 'fs'

const sharp = require('sharp')
import path from 'path'
import * as multerUpload from '../util/multerUpload'

var ffmpeg = require('ffmpeg');

/** for test redis */
// import {createClient} from 'redis'
// const redisClient = createClient()
// redisClient.on('error', (err: any) => console.log('Redis Client Error', err))
// redisClient.connect()
/** for test redis */

/** for test socket */
import { SIO } from '../util/Sockets'


export class UserController {
    OnGetAll = async(req: any, res: any) => {
        const redisCacheKey = 'nexttest:getalluser'
        // const dataRedisCached = await redisClient.get(redisCacheKey)
        // if(dataRedisCached){
        //     SIO.getIO().emit("testroom", 'get user all from redis')
        //     return res.status(200).json({
        //         status: true,
        //         message:'ok',
        //         description: 'get data success.',
        //         data: {
        //             user: JSON.parse(dataRedisCached)
        //         }
        //     })
        // }
        /* finding data */
        const finding = await Users.findAll()
        // redisClient.setEx(redisCacheKey, 60*5, JSON.stringify(finding))
        SIO.getIO().emit("testroom", 'get user all')
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
        const redisCacheKey = `nexttest:getbyid-${req.params.id}`
        // const dataRedisCached = await redisClient.get(redisCacheKey)
        // if(dataRedisCached){
        //     console.log('dataRedis')
        //     return res.stastua(200).json({
        //         status: true,
        //         message: 'ok',
        //         description: 'get data success.',
        //         data: {
        //             user: JSON.parse(dataRedisCached)
        //         }
        //     })
        // }
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
            let image = ''
            if(req.file){
                let upload = "uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname);
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                image = await sharp(req.file.path)
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
            }
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
        /* finding old data */
        const finding = await Users.findOne({where:{refresh_token: req.params.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user is not found.'
            })
        }
        try {
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
                data: access_token
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }
    }
    OnCheckAccessToken = async (req: any, res: any, next: any) => {
        const access_token = req.params.token
        if(!access_token){
            return res.status(401).json({
                message: 'Not Authenticated.'
            })
        }
        /* receive bearer token from header */
        let decodedToken: any
        /* if having token */
        if(access_token != ''){
            try {
                /* verify token for get data and check expire token */
                decodedToken = await jwt.verify(access_token, `${Config.secretKey}`)
                /* if token was expired */
                if(moment().unix() > decodedToken.exp){
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: 'token was expired.'
                    })
                }
                /* data keep for use when update data in database */
                req.authToken = access_token
                return res.status(200).json({
                    status: true,
                    message: 'token is correct.'
                })
            } catch(error) {
                return res.status(401).json({ 
                    status: false, 
                    message:'error', 
                    description: "authentication failed, token was expired!"
                })
            }
        }
    }

    
    OnTestUploadImage = async(req: any, res: any) => {
        try {
            let image = ''
            if(req.files[0]){
                let upload = "uploads"+req.files[0].destination.split("uploads").pop()
                let dest = req.files[0].destination
                var ext = path.extname(req.files[0].originalname)
                let originalname = path.basename(req.files[0].originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                image = await sharp(req.files[0].path)
                .resize(200, 200)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.files[0].destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.files[0].path, (err) => {
                        console.log(err)
                    })
                    return upload+originalname+ext
                })
            }
            return res.status(201).json({
                url: `http://192.168.1.51:4200/${image}`,
                uploaded: true,
            })
        } catch(errorr){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnTestUploadVideo = async(req: any, res: any) => {
        try {
            const file = req.files[0]
            console.log(file)
            var process = new ffmpeg(file.path);
            process.then(function (video: any, err: any) {
                video.setVideoFrameRate(25)
                .setVideoSize('640x?', true, true, '#fff')
                .setAudioQuality(128)
                // .save(`${file.destination}${file.originalname}`)
                if (!err) {
                    console.log('The video is ready to be processed');
                } else {
                    console.log('Error: ' + err);
                }
            });
            return res.json()
        } catch (e: any) {
            console.log(e)
            return res.json({
                data: e
            })
        }
    }
}