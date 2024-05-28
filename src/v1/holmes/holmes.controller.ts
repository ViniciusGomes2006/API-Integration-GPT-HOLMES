import express from "express";
import { checkTaskValueIsNull, donwloadDocument, getDocuments, getLastActivities, getTaskParameters, postActionTask, saveDocuments } from "./holmes.service";
import { chatGenerate } from "../../services/gpt.service";
import { ActionDetails, Task, TaskProperty, userProperty,  } from "./holmes.interfaces";

export const holmesRouter = express.Router();

export interface RequestBody {
  task: Task;
}

holmesRouter.get("/", express.json(), async (req, res) => {
	try {
		const { id, properties, documents } = req.body;

		const userProperties: userProperty = {
			user_info: {
				name: properties["Nome completo"],
				nationality: properties["Nacionalidade"],
				identification: properties["N° de PASSAPORTE/RG"],
				cpf: properties["CPF"] || "",
				job: properties["Profissão"],
				marital_status: properties["Estado civil"],
				email: properties["Email"] || ""
			},
			user_location: {
				address: properties["Rua"] || "",
				neighborhood: properties["Bairro"] || "",
				city: properties["Cidade"] || "",
				state: properties["Estado"] || "",
				zip_code: properties["CEP"] || ""
			}
		};
  
		const documentData = await getDocuments(documents[0].document_id);
		const binaryDataDocument = await donwloadDocument(documentData.url);

		saveDocuments(binaryDataDocument);

		// const lastActivityId = await getLastActivities(id);
		// const taskParameters = await getTaskParameters(lastActivityId);

		// const actionArray: ActionDetails[] = Object.values(taskParameters.actions);
		// const taskArray: TaskProperty[] = Object.values(taskParameters.properties);
		
		// const actionId = actionArray[0].id;

		// console.log(taskArray);
		// console.log(actionId);

		// if(!checkTaskValueIsNull(taskArray, "a3f58400-08d4-11ef-b7c2-b357a94668ac")) {
		// 	return res.status(400).send("Task value is not null");
		// }

		// const newData = await chatGenerate("prompt", "user", "Gere um lorem impsun de 10 palavras");
		// const testBody: RequestBody = {
		// 	task: {
		// 		action_id: actionId,
		// 		property_values: [
		// 			{
		// 				id: "a3f58400-08d4-11ef-b7c2-b357a94668ac",
		// 				value: `${newData}`
		// 			}
		// 		],
		// 		confirm_action: true
		// 	}
		// };

		// return postActionTask(lastActivityId, testBody).then(data => res.json(data));
		// return res.json(userProperties);
	} catch (error) {
		// console.log(error);
	}

});
