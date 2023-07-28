import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("user route get");
});

router.post("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("user route post");
});

export default router;
