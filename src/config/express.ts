import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import { Request, Response } from "express";
import * as morgan from "morgan";
import * as path from "path";

import { status } from "@/constants/http";
import { respondError } from "@/helpers/response";
import routes from "@/routes";
import { handleError } from "@/utils/error";

export const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "..", "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", routes);
app.use("/api/*", (_req: Request, res: Response) => {
  return respondError(
    res,
    status.HTTP_404_NOT_FOUND,
    "Sorry, api path not found.",
  );
});

// global error handler
app.use((err, _req, res, _next) => {
  handleError(err);
  return respondError(
    res,
    status.HTTP_500_INTERNAL_SERVER_ERROR,
    "Something went wrong!",
  );
});
