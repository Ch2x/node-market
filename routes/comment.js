import express from 'express'
import Comment from '../controller/comment'

const router = express.Router();

router.post('/postComment', Comment.postComment);

export default router;