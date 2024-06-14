import express from "express";
import { contractRouter } from "../v1/contract/contract.controller";

export const Router = express.Router();

// http://domain/v1/contract
Router.use("/contract", contractRouter);