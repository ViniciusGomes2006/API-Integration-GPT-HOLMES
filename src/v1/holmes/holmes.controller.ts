import express from "express";
import bodyParser from "body-parser";
import { getLastActivities, getTaskParameters, postActionTask } from "./holmes.service";
import { chatGenerate } from "../../services/gpt.service";
import axios from "axios";

export const holmesRouter = express.Router();

interface TaskParameter {
  id: string;
  name: string;
  value: string;
}

interface ActionParameter {
  id: string;
  name: string;
}

interface Task {
  action_id: string;
  property_values: {
    id: string;
    value: string;
  }[];
  confirm_action: boolean;
}

export interface RequestBody {
  task: Task;
}

holmesRouter.get("/", bodyParser.json(), async (req, res) => {
	try {
		const { id } = req.body;
		const lastActivityId = await getLastActivities(id);
		const taskParameters = await getTaskParameters(lastActivityId);
		const actionArray: ActionParameter[] = Object.values(taskParameters.actions);
		const taskArray: TaskParameter[] = Object.values(taskParameters.properties);
		const actionId = actionArray[0].id;

		let taskValueIsNull: boolean = false;

		taskArray.forEach(task => {
			if (task.id !== "a3f58400-08d4-11ef-b7c2-b357a94668ac") return;

			taskValueIsNull = !task.value ? true : false;
		});

		if (!taskValueIsNull) {
			return res.end("Ja existe um valor na atividade");
		}
    
		const newData = await chatGenerate("prompt", "user", "Gere um lorem impsun de 10 palavras");
		const body: RequestBody = {
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

		postActionTask(lastActivityId, body).then(data => console.log(data));

		return res.end(lastActivityId);
	} catch (error) {
		console.log(error);
	}

});
