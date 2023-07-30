import { Router, Request, Response } from "express";

const router = Router();
const getHandler = (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("login route get");
};
const postHandler = (req: Request, res: Response) => {
  res.statusCode = 200;
  return res.send("login route post");
};

router.get("/", getHandler);

router.post("/", postHandler);

export { router, getHandler, postHandler };
export default router;
