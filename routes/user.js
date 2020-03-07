import express from 'express'
import expressWs from 'express-ws'
import User from '../controller/user'

const router = express.Router()

expressWs(router);

router.post('/registered', User.registered);
router.post('/login', User.login);
router.get('/logout', User.logout);
router.post('/updateAvatar', User.updateAvatar);
// router.get('/changePassword', User.changePassword);
router.post('/getcaptchas', User.getcaptchas);
router.post('/setPassword', User.setPassword);
router.ws('/loginSucceed',User.loginSucceed);

export default router;