import express from "express";
import { holmesRouter } from "../v1/holmes/holmes.controller";

export const Router = express.Router();

Router.use("/holmes", holmesRouter);