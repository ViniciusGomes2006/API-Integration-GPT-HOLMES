import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { RequestBody } from "./holmes.controller";
import { TaskProperty } from "./holmes.interfaces";

dotenv.config();

const holmesApiToken = process.env.HOLMES_API_TOKEN;

export async function getLastActivities(processID: string) {
	try {
		const response = await axios.get(`https://app-api.holmesdoc.io/v1/processes/${processID}`, {
			headers: {
				"api_token": holmesApiToken
			}
		});

		const arrayActivities = response.data.current_activities;
		const lastActivityId = arrayActivities[arrayActivities.length - 1].id;

		return lastActivityId;
	} catch (error) {
		return error;
	}
}

export async function getTaskParameters(activityId: string) {
	try {
		const response = await axios.get(`https://app-api.holmesdoc.io/v1/tasks/${activityId}`, {
			headers: {
				"api_token": holmesApiToken
			}
		});
		return response.data;
	} catch (error) {
		return error;
	}
}
export async function getDocuments(documentId: string) {
	try {
		const response = await axios.get(`https://app-api.holmesdoc.io/v2/documents/${documentId}`, {
			headers: {
				"api_token": holmesApiToken
			}
		});
		return response.data;
	} catch (error) {
		return error;
	}
}
export async function donwloadDocument(urlDocument: string) {
	try {
		const response = await axios.get(`${urlDocument}`, {
			responseType: "arraybuffer"
		});

		const binaryData = Buffer.from(response.data, "base64");
		return binaryData;
	} catch (error) {
		return `${error}`;
	}
}

export async function saveDocuments(binaryData: Buffer | string) {
	const folderPath = "./gallery/documents";

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}

	const filePath = path.join(folderPath, "document.jpeg");

	fs.writeFileSync(filePath, binaryData); 

	return filePath;
}

export async function postActionTask(taskId: string, body: RequestBody) {
	try {
		const response = await axios.post(`https://app-api.holmesdoc.io/v1/tasks/${taskId}/action`, body, {
			headers: {
				"api_token": holmesApiToken
			}
		});
    
		return response.data;
	} catch (error) {
		return error;
	}
}

export function checkTaskValueIsNull(taskArray: TaskProperty[], taskId: string): boolean {
	let taskValueIsNull: boolean = false;

	taskArray.forEach(task => {
		if (task.id !== taskId) return;

		taskValueIsNull = !task.value ? true : false;
	});

	console.log(taskValueIsNull);

	return taskValueIsNull;
}