import express from "express";
import { getProcessId } from "./v1/holmes/holmes.service";

const app = express();

app.get("/", (req, res) => {
	res.end("Olá, mundo!");
});

getProcessId("66354214a7524200878da88f");

app.listen(3000, () => {
	console.log("Servidor rodando na porta 3000");
});
