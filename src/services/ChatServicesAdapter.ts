import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const gpt_organization_token = process.env.OPENAI_ORG_ID;
const gpt_api_token = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	organization: gpt_organization_token,
	apiKey: gpt_api_token,
});


/**
 * Asynchronously generates chat responses based on the provided prompt using GPT-4 Turbo model.
 *
 * @param {string} _name - The name of the chat participant. Defaults to "prompt".
 * @param {string} _role - The role of the chat participant. Can be "function", "system", "user", or "assistant". Defaults to "user".
 * @param {string} prompt - The text prompt to generate responses.
 * @return {AsyncGenerator<string>} An async generator yielding chat response strings.
 */
export async function* chatGenerate(_name: string = "prompt", _role: "function" | "system" | "user" | "assistant" = "user", prompt: string): AsyncGenerator<string> {
	const assistant = await openai.chat.completions.create({
		model: "gpt-4-turbo",
		messages: [{ name: _name, role: _role, content: prompt }],
		stream: true,
	});

	for await (const chunk of assistant) {
		const response = chunk.choices[0].delta?.content || "";
		yield response;
	}
}