import express from "express";
import { qualificationRouter } from "../v1/qualification/qualification.controller";
import { commissionRouter } from "../v1/commission/commission.controller";

export const Router = express.Router();

// http://domain/v1/qualification
Router.use("/qualification", qualificationRouter);

// http://domain/v1/commission
Router.use("/commission", commissionRouter);