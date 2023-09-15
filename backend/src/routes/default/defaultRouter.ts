import { Router, Request, Response } from "express";
import path from "path";

const router = Router();

router.get("*", (req: Request, res: Response) => {
  //Stupid, but it works -> need pathing based of build dist after 'compile'
  const fileName = "index.html";
  return res.sendFile(path.join(__dirname, "..", "..", "..", "..", "..", "_frontend_build", "index.html"));
});

export default router;
