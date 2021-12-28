"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const TokenVerify = require('../middlewares/TokenVerify');
const InstructorController = require('../controllers/InstructorController');
router.post('/login', InstructorController.login);
router.use(TokenVerify.tokenVerify);
router.get('/getClass', InstructorController.getClass);
router.post('/updateDetails', InstructorController.updateDetails);
// router.post('/addCourseMaterial')
module.exports = router;
