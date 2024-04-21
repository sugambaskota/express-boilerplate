import * as express from "express";

import authRoutes from "@/routes/auth";
import blogRoutes from "@/routes/blog";
import contactMessageRoutes from "@/routes/contact-message";
import uploadRoutes from "@/routes/upload";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/blogs", blogRoutes);
router.use("/contact-messages", contactMessageRoutes);

export default router;
