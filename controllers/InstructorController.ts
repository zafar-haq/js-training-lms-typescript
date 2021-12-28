'use strict'
import { Request, Response } from "express"
const InstructorModel = require('../models').Instructor
const Student = require('../models').Student
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ValidationError } = require('sequelize')

interface Resp {
    error:string, 
    success:string,
    token:string,
    message:string,
    data:object
}
let response:Resp = {
    error:"",
    success:"",
    token:"",
    message:"",
    data:{}
};

module.exports.login = async function (req:Request, res:Response) {
    response.error = "user not found."
    let status_code = 400

    const instructor = await InstructorModel.findOne({
        where: { email: req.body.email }
    })

    if (instructor) {
        let result = await bcrypt.compare(req.body.password, instructor.password)
        if (result === true) {
            response.success = "user logged in successfully." 
            response.token = jwt.sign({ user: { id: instructor.id, email: instructor.email } }, 'sha256', { expiresIn: '2h' })
            status_code = 200
        } else {
            response.error = "wrong password." 
        }
    }

    res.status(status_code).json(response)

}


module.exports.getClass = async function (req:any, res:Response) {
    response.data = {} 
    let status_code = 200
    try {
        const instructor = await InstructorModel.findByPk(req.user.id)
        const classes = await instructor.getClass({
            attributes: ['id', 'course_name', 'strength', 'enrolledStudents'],
            include: {
                model: Student,
                attributes: ['id', 'email', 'password', 'name'],
                through: { attributes: [] }
            }
        });
        response.data = classes
    } catch (e:any) {
        response.error = e.message
        status_code = 500
    }
    res.status(status_code).json(response)

}


module.exports.updateDetails = async function (req:any, res:Response){
    response.message = 'details updated successfully'
    let status_code = 200
    try{
        let data_to_update: {[k: string]: any} = {}
        if(req.body.hasOwnProperty('name')){
            data_to_update.name = req.body.name
        }
        if(req.body.hasOwnProperty('password')){
            data_to_update.password = await bcrypt.hash(req.body.password, 10)
        }
        InstructorModel.update(data_to_update, {where:{id:req.user.id}})
    }catch(e:any){
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