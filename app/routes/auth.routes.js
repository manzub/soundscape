import { Router } from "express";
import { createNewUser, loginUser, verifyOAuth } from "../controller/authController.js";

const router = Router();

router.post('/gg-oath2-verify', verifyOAuth);
router.post('/login-user', loginUser);
router.post('/create-new-user', createNewUser)

export default router;