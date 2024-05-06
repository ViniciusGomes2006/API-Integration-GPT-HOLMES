import express from "express";
import { chatGenerate } from "./gpt.service";

const v1Router = express.Router();

v1Router.get("/v1/gpt", async (req, res) => {
	try {
		const assistant = await chatGenerate("prompt", "user", req.query.prompt as string);
     
		res.setHeader(
			"Content-Type",
			"utf-8",
		);

		for await (const chunk of assistant) {
			res.write(chunk);
		}
     
		res.end();
	} catch (error) {
		console.error("Error while processing the response:", error);
		res.status(500).send("Internal server error.");
	}
});