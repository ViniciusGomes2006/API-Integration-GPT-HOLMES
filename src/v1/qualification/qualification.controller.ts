import express from "express";
import { checkTaskValueIsNull, getDocuments, getLastActivities, getTaskParameters, postActionTask } from "../../services/holmesRequest/holmesRequest.Services";
import { chatGenerate } from "../../services/gpt.service";
import { userProperty } from "./qualification.interfaces";
import { ActionDetails, TaskProperty, RequestBody } from "../../services/holmesRequest/holmesRequest.interface";
import { saveDocument } from "../../utils/imageServices";
import { promptSystem } from "../../utils/prompt/promptData";

export const qualificationRouter = express.Router();

qualificationRouter.get("/", express.json(), async (req, res) => {
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

		const lastActivityId = await getLastActivities(id);
		const taskParameters = await getTaskParameters(lastActivityId);

		const actionArray: ActionDetails[] = Object.values(taskParameters.actions);
		const taskArray: TaskProperty[] = Object.values(taskParameters.properties);

		const actionId = actionArray[0].id;
    
		if(!checkTaskValueIsNull(taskArray, "37fd3370-1c65-11ef-8893-0369865f015c")) {
			return res.status(400).send("Task value not are null");
		}

		const documentData = await getDocuments(documents[0].document_id);
		const binaryDataDocument = await saveDocument(documentData.url);

		const {user_info, user_location} = userProperties;
		const prompt = `Nome: ${user_info.name}, Nacionalidade: ${user_info.nationality}, N° de PASSAPORTE/RG: ${user_info.identification}, CPF: ${user_info.cpf}, Profissão: ${user_info.job}, Estado Civil: ${user_info.marital_status}, email: ${user_info.email}, Rua: ${user_location.address}, Bairro: ${user_location.neighborhood}, Cidade: ${user_location.city}, Estado: ${user_location.state}, CEP: ${user_location.zip_code}`;

		const newData = await chatGenerate("Crie uma qualificação: " + prompt, binaryDataDocument, promptSystem);

		const bodyRequest: RequestBody = {
			task: {
				action_id: actionId,
				property_values: [
					{
						id: "37fd3370-1c65-11ef-8893-0369865f015c",
						value: newData || ""
					}
				],
				confirm_action: true
			}
		};

		return postActionTask(lastActivityId, bodyRequest).then(data => res.json(data));
	} catch (error) {
		console.log(error);
	}

});

export { RequestBody };
