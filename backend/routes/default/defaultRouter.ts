import { Router, Request, Response } from "express";
import path from "path";

const router = Router();

router.get("*", (req: Request, res: Response) => {
  return res.sendFile(
    path.join(__dirname, "..", "..", "..", "_frontend_build", "index.html")
  );
});

export default router;
