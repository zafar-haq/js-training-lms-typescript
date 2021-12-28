import express from 'express'
const router = express.Router()
const TokenVerify = require('../middlewares/TokenVerify')
const UploadCourseMaterialMiddleware = require('../middlewares/UploadCourseMaterialMiddleware')
const CourseMaterialController = require('../controllers/CourseMaterialController')

router.use(TokenVerify.tokenVerify)

router.post('/:classId/upload', UploadCourseMaterialMiddleware.checkClassExists, CourseMaterialController.upload, CourseMaterialController.create)


module.exports = router