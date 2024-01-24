/* eslint-disable no-console */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
export const app: Application = express();

// middleware
app.use(express.json());
app.use(cors());
//test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//application routes

app.use("/api", router);

//global error handling middlewares
app.use(globalErrorHandler);

//not found middleware
app.use(notFound);
