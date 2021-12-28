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
const StudentModel = require('../models').Student;
const InstructorModel = require('../models').Instructor;
const AdminModel = require('../models').Admin;
const ClassModel = require('../models').Class;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
let response = {
    error: "",
    success: "",
    token: "",
    message: ""
};
module.exports.login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response.error = "user not found.";
        let status_code = 400;
        const admin = yield AdminModel.findOne({
            where: { email: req.body.email }
        });
        if (admin) {
            let result = yield bcrypt.compare(req.body.password, admin.password);
            if (result === true) {
                response.success = "user logged in successfully.";
                response.token = jwt.sign({ user: { id: admin.id, email: admin.email } }, 'sha256', { expiresIn: '2h' });
                status_code = 200;
            }
            else {
                response.error = "wrong password.";
            }
        }
        res.status(status_code).json(response);
    });
};
module.exports.createRole = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        response.error = 'role not found.';
        let status_code = 400;
        try {
            if (req.params.role === 'student') {
                const student = yield StudentModel.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: yield bcrypt.hash(req.body.password, 10)
                });
                response.message = 'Student created successfully.';
                status_code = 201;
            }
            else if (req.params.role === 'instructor') {
                const instructor = yield InstructorModel.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: yield bcrypt.hash(req.body.password, 10)
                });
                response.message = 'Instructor created successfully.';
                status_code = 201;
            }
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
module.exports.createClass = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        let status_code = 200;
        try {
            const classObj = yield ClassModel.create({
                course_name: req.body.course_name,
                strength: req.body.strength
            });
            response.message = 'Class created successfully.';
            status_code = 201;
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
module.exports.assignInstructor = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let status_code = 200;
        try {
            req.instructorObj.setClass(req.classObj);
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
