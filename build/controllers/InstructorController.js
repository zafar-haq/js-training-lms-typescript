'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const InstructorModel = require('../models').Instructor;
const Student = require('../models').Student;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('sequelize');
let response = {
    error: "",
    success: "",
    token: "",
    message: "",
    data: {}
};
module.exports.login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response.error = "user not found.";
        let status_code = 400;
        const instructor = yield InstructorModel.findOne({
            where: { email: req.body.email }
        });
        if (instructor) {
            let result = yield bcrypt.compare(req.body.password, instructor.password);
            if (result === true) {
                response.success = "user logged in successfully.";
                response.token = jwt.sign({ user: { id: instructor.id, email: instructor.email } }, 'sha256', { expiresIn: '2h' });
                status_code = 200;
            }
            else {
                response.error = "wrong password.";
            }
        }
        res.status(status_code).json(response);
    });
};
module.exports.getClass = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response.data = {};
        let status_code = 200;
        try {
            const instructor = yield InstructorModel.findByPk(req.user.id);
            const classes = yield instructor.getClass({
                attributes: ['id', 'course_name', 'strength', 'enrolledStudents'],
                include: {
                    model: Student,
                    attributes: ['id', 'email', 'password', 'name'],
                    through: { attributes: [] }
                }
            });
            response.data = classes;
        }
        catch (e) {
            response.error = e.message;
            status_code = 500;
        }
        res.status(status_code).json(response);
    });
};
module.exports.updateDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response.message = 'details updated successfully';
        let status_code = 200;
        try {
            let data_to_update = {};
            if (req.body.hasOwnProperty('name')) {
                data_to_update.name = req.body.name;
            }
            if (req.body.hasOwnProperty('password')) {
                data_to_update.password = yield bcrypt.hash(req.body.password, 10);
            }
            InstructorModel.update(data_to_update, { where: { id: req.user.id } });
        }
        catch (e) {
            if (e instanceof ValidationError) {
                response.error = e.errors[0].message;
                status_code = 400;
            }
            else {
                response.error = e.message;
                status_code = 500;
            }
        }
        res.status(status_code).json(response);
    });
};
