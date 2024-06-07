import axios from "axios";

export async function saveDocument(urlDocument: string) {
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