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
 * @param {string} _name - The name of the chat participant. Defaults to "prompt".
 * @param {string} _role - The role of the chat participant. Can be "function", "system", "user", or "assistant". Defaults to "user".
 * @param {string} prompt - The text prompt to generate responses.
 * @return {AsyncGenerator<string>} An async generator yielding chat response strings.
 */
export async function chatGenerate(_name: string = "prompt", _role: "function" | "system" | "user" | "assistant" = "user", prompt: string) {
	const assistant = await openai.chat.completions.create({
		model: "gpt-4-turbo",
		messages: [{ name: _name, role: _role, content: prompt }],
	});

	return assistant.choices[0].message.content;
}