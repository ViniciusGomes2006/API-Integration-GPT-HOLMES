import express from "express";
import { chatGenerate } from "./services/ChatServicesAdapter";

const app = express();

app.get("/", async (req, res) => {
	try {
		const assistant = await chatGenerate("prompt", "user", req.query.prompt as string);
     
		res.setHeader("Content-Type", "text/plain");

		for await (const chunk of assistant) {
			res.write(chunk);
		}
     
		res.end();
	} catch (error) {
		console.error("Error while processing the response:", error);
		res.status(500).send("Internal server error.");
	}
});


app.listen(3000, () => {
	console.log("Server started on port 3000");
});