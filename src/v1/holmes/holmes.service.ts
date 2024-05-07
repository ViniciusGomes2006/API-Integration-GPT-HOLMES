import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const holmes_api_token = process.env.HOLMES_API_TOKEN;

export async function getProcessActivities(processID: string) {
	try {
		const response = await axios.get(`https://app-api.holmesdoc.io/v1/processes/${processID}`, {
			headers: {
				"api_token": holmes_api_token
			}
		});

		const arrayActivities = response.data.current_activities;
		const lastActivity = arrayActivities[arrayActivities.length - 1];

		return lastActivity;
	} catch (error) {
		return error;
	}
}

// export async function getTaskParameters(activityId: string) {
// 	try {
// 		const response = await axios.get(`https://app-api.holmesdoc.io/v1/tasks/${activityId}`, {
// 			headers: {
// 				"api_token": holmes_api_token
// 			}
// 		});
// 		return response.data;
// 	} catch (error) {
// 		return error;
// 	}
// }