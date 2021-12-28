import express from 'express'
const router = express.Router()
const TokenVerify = require('../middlewares/TokenVerify')
const enrollMiddleware = require('../middlewares/EnrollMiddleware')
const StudentController = require('../controllers/StudentController')

router.post('/login', StudentController.login)

router.use(TokenVerify.tokenVerify)

router.post('/enroll', enrollMiddleware.checkAvailability, StudentController.enroll)

router.get('/getClasses', StudentController.getClasses)

router.post('/updateDetails', StudentController.updateDetails)

router.get('/getCourseMaterial', StudentController.getCourseMaterial)

module.exports = router