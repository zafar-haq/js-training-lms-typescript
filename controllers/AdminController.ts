'use strict'
import { Request, Response } from "express"
const StudentModel = require('../models').Student
const InstructorModel = require('../models').Instructor
const AdminModel = require('../models').Admin
const ClassModel = require('../models').Class
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');

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

module.exports.login = async function (req:Request, res:Response) {
    
    response.error = "user not found."
    let status_code = 400

    const admin = await AdminModel.findOne({
        where: { email: req.body.email }
    })

    if (admin) {
        let result = await bcrypt.compare(req.body.password, admin.password)
        if (result === true) {
            response.success = "user logged in successfully.";
            response.token = jwt.sign({ user: { id: admin.id, email: admin.email } }, 'sha256', { expiresIn: '2h' }) 
            status_code = 200
        } else {
            response.error = "wrong password."
        }
    }

    res.status(status_code).json(response)

}

module.exports.createRole = async function (req:Request, res:Response) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    

    response.error = 'role not found.'
    let status_code = 400
    try {
        if (req.params.role === 'student') {
            const student = await StudentModel.create({
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10)
            })
            response.message = 'Student created successfully.'
            status_code = 201
        } else if (req.params.role === 'instructor') {
            const instructor = await InstructorModel.create({
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10)
            })
            response.message = 'Instructor created successfully.'
            status_code = 201
        }

    } catch (e:any) {
        if (e instanceof ValidationError) {
            response.error = e.errors[0].message
            status_code = 400
        } else {
            response.error = e.message
            status_code = 500
        }
    }
    res.status(status_code).json(response)
}


module.exports.createClass = async function (req:Request, res:Response) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }

    let status_code = 200

    try {
        const classObj = await ClassModel.create({
            course_name: req.body.course_name,
            strength: req.body.strength
        })
        response.message = 'Class created successfully.'
        status_code = 201
    } catch (e:any) {
        if (e instanceof ValidationError) {
            response.error = e.errors[0].message
            status_code = 400
        } else {
            response.error = e.message
            status_code = 500
        }
    }

    res.status(status_code).json(response)

}

module.exports.assignInstructor = async function (req:any, res:Response) {
    let status_code = 200
    try {
        req.instructorObj.setClass(req.classObj)
    } catch (e:any) {
        if (e instanceof ValidationError) {
            response.error = e.errors[0].message
            status_code = 400
        } else {
            response.error = e.message
            status_code = 500
        }
    }
    res.status(status_code).json(response)
}

