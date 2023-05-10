import { NextFunction, Request, Response, Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { courseRouter } from "./course";
import { contentRouter } from "./content";
import { FileRequest, fileController } from "../controller/file";
import { exerciseRouter } from "./exercise";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import path from "path";
import { randomUUID } from "crypto";

const router = Router();
router.post(
  "/test",
  fileController.getFile,
  fileController.upload,
  async (req: FileRequest, res: Response) => {
    // console.log(req.files);
    // console.log(req.firebase);
    res.sendStatus(200);
  }
);
router.use(authRouter);
router.use(exerciseRouter);
router.use(userRouter);
router.use(courseRouter);
router.use(contentRouter);
router.get("/view/:url", fileController.get);
router.all("*", (_: Request, res: Response) => {
  res.status(404).send("API Endpoint Not Found");
});

export { router as apiRouter };
