import express from "express";
import { routes } from "./routes/route";

export const api = express();

api.use(express.json());

api.use("/api", routes);
