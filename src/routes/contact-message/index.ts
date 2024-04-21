import { Router } from "express";

import * as contactMessageController from "@/controllers/contact-message";
import { isSuperAdmin } from "@/middlewares/auth";
import * as contactMesssageSchema from "@/validation/schemas/contact-message";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/")
  .get(
    isSuperAdmin,
    validator.validateRequestPagination,
    contactMessageController.getContactMessages,
  );

router
  .route("/:id")
  .get(isSuperAdmin, contactMessageController.getContactMessageById);

router
  .route("/")
  .post(
    validator.validateRequestBody(
      contactMesssageSchema.CreateContactMessageSchema,
    ),
    contactMessageController.createContactMessage,
  );

router
  .route("/:id")
  .delete(isSuperAdmin, contactMessageController.deleteContactMessage);

export default router;
