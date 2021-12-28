"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const TokenVerify = require('../middlewares/TokenVerify');
const enrollMiddleware = require('../middlewares/EnrollMiddleware');
const StudentController = require('../controllers/StudentController');
router.post('/login', StudentController.login);
router.use(TokenVerify.tokenVerify);
router.post('/enroll', enrollMiddleware.checkAvailability, StudentController.enroll);
router.get('/getClasses', StudentController.getClasses);
router.post('/updateDetails', StudentController.updateDetails);
router.get('/getCourseMaterial', StudentController.getCourseMaterial);
module.exports = router;
