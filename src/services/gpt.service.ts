import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const gptOrganizatioToken = process.env.OPENAI_ORG_ID;
const gptApiToken = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	organization: gptOrganizatioToken,
	apiKey: gptApiToken,
});

/**
 * Asynchronously generates chat responses based on the provided prompt using GPT-4 Turbo model.
 *
 * @param {string} prompt - The text prompt to generate responses.
 * @param {Buffer | string} binaryDocument - The binary document or base64-encoded string to be included in the chat message.
 * @param {string} promptSystem - The system prompt to be sent along with the user prompt.
 * @return {Promise<string | null>} The generated assistant content or null if an error occurred.
 */
export async function chatGenerate(prompt: string, binaryDocument: Buffer | string | null, promptSystem: string) {
	try {
		const base64Image = binaryDocument ? binaryDocument.toString("base64") : null;

		const assistant =  await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: promptSystem
				},
				{
					role: "user",
					content: [
						base64Image ?? {

						},
						{
							type: "image_url",
							image_url: {
								url: `data:image/jpeg;base64,${base64Image}`
							}
						},
						{
							type: "text",
							text: prompt
						}
					]
				},
			],
		});
  
		const assistantContent: string | null = assistant.choices[0].message.content;

		return assistantContent;
	} catch (error) {
		console.log(error);
	}
}
