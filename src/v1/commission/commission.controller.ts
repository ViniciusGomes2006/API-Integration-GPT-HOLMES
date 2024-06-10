import express from "express";
import { propertiesType } from "./commission.interface";
import { checkTaskValueIsNull, getLastActivities, getTaskParameters } from "../../services/holmesRequest/holmesRequest.Services";
import { ActionDetails, TaskProperty } from "../../services/holmesRequest/holmesRequest.interface";
import { chatGenerate } from "../../services/gpt.service";
import { promptSystem } from "../../utils/prompt/promptData";

export const commissionRouter = express.Router();

commissionRouter.post("/", express.json(), async (req, res) => {
	const { id, properties } = req.body;

	const TaskProperties: propertiesType = {
		closed_deal: properties["Fechou negócio"],
		registration_goal: properties["Meta de cadastros"],
		photo_goal: properties["Meta de fotos"],
		productivity_goal: properties["Meta de produtividade"],
		admin_tax: properties["Taxa de adm"],
		property_registered: properties["Cadastrou Imóvel"],
		total_commission: properties["Comissão Total"]
	};

	const lastActivityId = await getLastActivities(id);
	const taskParameters = await getTaskParameters(lastActivityId);

	// const actionArray: ActionDetails[] = Object.values(taskParameters.actions);
	const taskArray: TaskProperty[] = Object.values(taskParameters.properties);

	// const action_id = actionArray[0].id;

	if(!checkTaskValueIsNull(taskArray, "cf64a4a0-24fd-11ef-aad4-c1ca5b6811d5")) {
		return res.status(400).send("Error: task value not are null");
	}

	const closedDeal = `Fechou o negócio: ${TaskProperties.closed_deal}`;
	const photoGoal = `Meta de fotos: ${TaskProperties.photo_goal}`;
	const registrationGoal = `Meta de cadastros: ${TaskProperties.registration_goal}`;
	const productivityGoal = `Meta de produtividade: ${TaskProperties.productivity_goal}`;
	const adminTax = `Taxa de adm: ${TaskProperties.admin_tax}%`;
	const propertyRegistered = `Cadastrou o imóvel: ${TaskProperties.property_registered}`;
	const totalValue = TaskProperties.total_commission;
  
	const prompt = `${closedDeal} • ${registrationGoal} • ${photoGoal} • ${productivityGoal} • ${adminTax} • ${propertyRegistered}`;

	chatGenerate(prompt, null, promptSystem).then(data => {
		return res.json(data);
	});

	return res.json(`${prompt} • Valor total: ${totalValue}`);
});