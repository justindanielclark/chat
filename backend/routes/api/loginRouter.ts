import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("login route get");
});

router.post("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("login route post");
});

export default router;
