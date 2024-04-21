import { Router } from "express";

import * as uploadController from "@/controllers/upload";
import { isAuth } from "@/middlewares/auth";

const router = Router();

router.route("/image").post(isAuth, uploadController.uploadImage);

router.route("/file").post(isAuth, uploadController.uploadFile);

export default router;
