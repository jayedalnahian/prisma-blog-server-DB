import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth";
import { UserRole } from "../../types/user";

const router = Router()

const { auth } = authMiddleware;


router.post("/", auth(UserRole.ADMIN), postController.createPost)
router.get('/', postController.getPost)

export const postRouter = router;