import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router()


router.post("/", postController.createPost)
router.get('/', authMiddleware.auth(), postController.getPost)

export const postRouter = router;