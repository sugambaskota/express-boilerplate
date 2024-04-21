import { Router } from "express";

import * as blogController from "@/controllers/blog";
import { isSuperAdmin } from "@/middlewares/auth";
import * as blogSchema from "@/validation/schemas/blog";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/")
  .get(validator.validateRequestPagination, blogController.getBlogs);

router.route("/:slug").get(blogController.getBlogBySlug);

router
  .route("/")
  .post(
    isSuperAdmin,
    validator.validateRequestBody(blogSchema.CreateBlogSchema),
    blogController.createBlog,
  );

router
  .route("/:id")
  .put(
    isSuperAdmin,
    validator.validateRequestBody(blogSchema.UpdateBlogSchema),
    blogController.updateBlog,
  );

router
  .route("/:id")
  .patch(
    isSuperAdmin,
    validator.validateRequestBody(blogSchema.PatchBlogSchema),
    blogController.updateBlog,
  );

router.route("/:id").delete(isSuperAdmin, blogController.deleteBlog);

export default router;
