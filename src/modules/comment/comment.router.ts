
import { Router } from "express";
import { commentController } from "./comment.controller";
import { UserRole } from "../../types/user";
import { authMiddleware } from "../../middlewares/auth";
const { auth } = authMiddleware;

const commentRouter = Router()

commentRouter.post('/', auth(UserRole.ADMIN, UserRole.USER), commentController.createComment)
commentRouter.delete('/:commentId', auth(UserRole.ADMIN, UserRole.USER), commentController.deleteComment)
commentRouter.get('/:id', auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentById)
commentRouter.get('/author/:authorId', auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentByAuthor)
commentRouter.patch('/:commentId', auth(UserRole.ADMIN, UserRole.USER), commentController.updateComment)
commentRouter.patch('/:commentId/moderate', auth(UserRole.ADMIN), commentController.moderateComment)






export default commentRouter;