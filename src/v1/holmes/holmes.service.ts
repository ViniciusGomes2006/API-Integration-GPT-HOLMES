import axios from "axios";

export async function getProcessId(processID: string) {
	try {
		const response = await axios.get(`https://app-api.holmesdoc.io/v1/processes/:${processID}`, {
			headers: {
				"api_token":"",
			}
		});
		console.log(response);
	} catch (error) {
		console.error(error);
	}
}