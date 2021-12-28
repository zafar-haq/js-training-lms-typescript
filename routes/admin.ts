import express from 'express'
const router = express.Router()
const TokenVerify = require('../middlewares/TokenVerify')
const AssignInstructorMiddleware = require('../middlewares/AssignInstructorMiddleware')
const AdminController = require('../controllers/AdminController')
const { body } = require('express-validator')

/**
 * @api {post} /admin/login request session login
 * @apiName adminLogin
 * @apiGroup Admin
 *
 * @apiBody {Email} {String} admins's unique email.
 *
 * @apiSuccess {String} success Success message.
 * @apiSuccess {String} token  Token for the Admin.
 */

router.post('/login', AdminController.login)

router.use(TokenVerify.tokenVerify) //middleware

router.post('/create/class', body('course_name', 'course name is required').exists(), body('strength').exists().isInt() , AdminController.createClass)
router.post('/create/:role', body('email', 'email must be valid').exists().isEmail(), body('password', 'password must be greater than 5 characters').isLength({min:5}), AdminController.createRole)
router.post('/assign/instructor',AssignInstructorMiddleware.verifyClassAndInstructor, AdminController.assignInstructor)


module.exports = router;