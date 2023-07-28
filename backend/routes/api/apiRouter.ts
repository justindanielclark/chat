import { Router } from "express";
import loginRouter from "./loginRouter";
import userRouter from "./userRouter";

const router = Router();

router.use("/login", loginRouter);
router.use("/user", userRouter);

export default router;
