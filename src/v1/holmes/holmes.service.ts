import axios from "axios";
import dotenv from "dotenv";
import { RequestBody } from "./holmes.controller";

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