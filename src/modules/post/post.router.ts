import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth";
import { UserRole } from "../../types/user";

const router = Router()

const { auth } = authMiddleware;


router.post("/", auth(UserRole.ADMIN), postController.createPost)
router.get('/stats', auth(UserRole.ADMIN), postController.getStats)
router.get('/', auth(UserRole.ADMIN, UserRole.USER), postController.getPost)
router.get('/:id', auth(UserRole.ADMIN, UserRole.USER), postController.getSinglePost)
router.get('/user/post', auth(UserRole.ADMIN, UserRole.USER), postController.getUserPosts)
router.patch('/:postId', auth(UserRole.ADMIN, UserRole.USER), postController.updatePost)
router.delete('/:postId', auth(UserRole.ADMIN, UserRole.USER), postController.deletePost)

export const postRouter = router;