import express from "express";
import { checkTaskValueIsNull, getLastActivities, getTaskParameters, postActionTask } from "./holmes.service";
import { chatGenerate } from "../../services/gpt.service";
import { ActionDetails, Task, TaskProperty,  } from "./holmes.interfaces";

export const holmesRouter = express.Router();

export interface RequestBody {
  task: Task;
}

holmesRouter.get("/", express.json(), async (req, res) => {
	try {
		const { id } = req.body;
		const lastActivityId = await getLastActivities(id);
		const taskParameters = await getTaskParameters(lastActivityId);
		const actionArray: ActionDetails[] = Object.values(taskParameters.actions);
		const taskArray: TaskProperty[] = Object.values(taskParameters.properties);
		const actionId = actionArray[0].id;

		if(!checkTaskValueIsNull(taskArray, "a3f58400-08d4-11ef-b7c2-b357a94668ac")) {
			return res.status(400).send("Task value is not null");
		}

		const newData = await chatGenerate("prompt", "user", "Gere um lorem impsun de 10 palavras");
		const testBody: RequestBody = {
			task: {
				action_id: actionId,
				property_values: [
					{
						id: "a3f58400-08d4-11ef-b7c2-b357a94668ac",
						value: `${newData}`
					}
				],
				confirm_action: true
			}
		};

		return postActionTask(lastActivityId, testBody).then(data => res.json(data));
	} catch (error) {
		// console.log(error);
	}

});
