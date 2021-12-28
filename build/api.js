'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const admin = require('./admin');
const student = require('./student');
const instructor = require('./instructor');
const courseMaterial = require('./courseMaterial');
const cors = require('cors');
var CryptoJS = require("crypto-js");
app.use(express_1.default.json());
app.use('/admin', admin);
app.use('/student', student);
app.use('/instructor', instructor);
app.use('/CourseMaterialRoute', courseMaterial);
app.use('/CourseMaterial', express_1.default.static('./CourseMaterial'));
app.use(cors());
app.get('/getEncrypted', (req, res) => {
    res.status(200).send(CryptoJS.AES.decrypt(req.query.input, "secret_key").toString(CryptoJS.enc.Utf8));
});
app.listen(8000, () => {
    console.log("server started listening on 8000");
});
