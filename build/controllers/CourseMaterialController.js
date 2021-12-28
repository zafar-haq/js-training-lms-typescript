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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const multer_1 = __importDefault(require("multer"));
const CourseMaterialModel = require('../models').CourseMaterial;
let response = {
    error: "",
    success: "",
    token: "",
    message: ""
};
module.exports.create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response.message = 'course material added.';
        let status_code = 200;
        try {
            yield CourseMaterialModel.create({
                name: req.name,
                file: req.file.path,
                classId: req.classObj.id
            });
        }
        catch (e) {
            response.error = e.message;
            status_code = 500;
        }
        res.status(status_code).json(response);
    });
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'CourseMaterial');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
module.exports.upload = (0, multer_1.default)({
    storage: storage
}).single('file');
