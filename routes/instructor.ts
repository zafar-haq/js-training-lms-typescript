import express from 'express'
const router = express.Router()
const TokenVerify = require('../middlewares/TokenVerify')
const InstructorController = require('../controllers/InstructorController')

router.post('/login', InstructorController.login)

router.use(TokenVerify.tokenVerify)

router.get('/getClass', InstructorController.getClass)

router.post('/updateDetails', InstructorController.updateDetails)

// router.post('/addCourseMaterial')

module.exports = router