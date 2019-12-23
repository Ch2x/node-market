import express from 'express'
import User from '../controller/user'

const router = express.Router()

router.post('/registered', User.registered);
router.post('/login', User.login);
router.get('/logout', User.logout);
router.post('/updateAvatar',User.updateAvatar);
// router.get('/changePassword', User.changePassword);
router.post('/getcaptchas', User.getcaptchas);
router.post('/setPassword', User.setPassword);

export default router;