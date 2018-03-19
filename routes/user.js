import express from 'express'
import User from '../controller/user'

const router = express.Router()

router.post('/registered', User.registered);
router.post('/login', User.login);
router.get('/logout', User.logout);
router.post('/updateAvatar',User.updateAvatar);

export default router;