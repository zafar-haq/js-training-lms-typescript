'use strict'
import { Request, Response } from "express"
const path = require('path')
import multer, { FileFilterCallback } from 'multer'
const CourseMaterialModel = require('../models').CourseMaterial

interface Resp {
    error:string, 
    success:string,
    token:string,
    message:string
}
let response:Resp = {
    error:"",
    success:"",
    token:"",
    message:""
};

module.exports.create = async function (req:any, res:Response) {
    response.message = 'course material added.'
    let status_code = 200
    try {
        await CourseMaterialModel.create({
            name: req.name,
            file: req.file.path,
            classId: req.classObj.id
        })
    }catch(e:any){
        response.error = e.message
        status_code = 500
    }

    res.status(status_code).json(response)
}

const storage = multer.diskStorage({
    destination: (req:Request, file:Express.Multer.File, cb:(error: Error | null, destination: string) => void) => {
        cb(null, 'CourseMaterial')
    },
    filename: (req:Request, file:Express.Multer.File, cb:(error: Error | null, filename: string) => void) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

module.exports.upload = multer({
    storage: storage
}).single('file')


