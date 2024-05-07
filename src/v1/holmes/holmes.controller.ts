import express from "express";

export const holmesRouter = express.Router();

holmesRouter.get("/", (req, res) => {
	res.end("Olá, mundo!");
});
