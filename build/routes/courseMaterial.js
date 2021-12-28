"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const TokenVerify = require('../middlewares/TokenVerify');
const UploadCourseMaterialMiddleware = require('../middlewares/UploadCourseMaterialMiddleware');
const CourseMaterialController = require('../controllers/CourseMaterialController');
router.use(TokenVerify.tokenVerify);
router.post('/:classId/upload', UploadCourseMaterialMiddleware.checkClassExists, CourseMaterialController.upload, CourseMaterialController.create);
module.exports = router;
