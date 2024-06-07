import express from "express";
import { propertiesType } from "./commission.interface";
import { checkTaskValueIsNull, getLastActivities, getTaskParameters } from "../../utils/holmesRequest/holmesRequest.Services";
import { ActionDetails, TaskProperty } from "../../utils/holmesRequest/holmesRequest.interface";

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

	const closedDeal = TaskProperties.total_commission * 0.25;
	const registrationGoal = TaskProperties.total_commission * 0.03;
	const photoGoal = TaskProperties.total_commission * 0.03;
	const productivityGoal = TaskProperties.total_commission * 0.02;
	const adminTax = TaskProperties.total_commission * (TaskProperties.admin_tax / 100);
	const propertyRegistered = TaskProperties.total_commission * 0.08;

	let taskValue: string = "";
	let totalValue: number = 0;

	function updateTaskValue(condition: boolean | number, value: number, description: string) {
		if (condition) {
			totalValue += value;
			taskValue += `${description}: ${value}, `;
		}
	}

	updateTaskValue(TaskProperties.closed_deal, closedDeal, "Fechou negócio");
	updateTaskValue(TaskProperties.registration_goal, registrationGoal, "Meta de cadastros");
	updateTaskValue(TaskProperties.photo_goal, photoGoal, "Meta de fotos");
	updateTaskValue(TaskProperties.productivity_goal, productivityGoal, "Meta de produtividade");
	updateTaskValue(TaskProperties.admin_tax, adminTax, "Taxa de adm");
	updateTaskValue(TaskProperties.property_registered, propertyRegistered, "Cadastrou Imóvel");

	const localeValue = totalValue.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return res.json(`${taskValue}e o Valor total: ${localeValue}`);
});