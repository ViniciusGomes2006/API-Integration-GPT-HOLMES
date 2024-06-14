import express from "express";
import { getDocuments } from "../../services/holmesRequest/holmesRequest.Services";
import { saveDocument } from "../../utils/imageServices";
import { chatGenerate } from "../../services/gpt.service";

export const contractRouter = express.Router();

interface RequestBodyDocuments {
  process_document_id: string;
  name: string
  document_id: string
  status: string
}

contractRouter.post("/", express.json(), async (req, res) => {
	const { id, properties, documents } = req.body;

	const propertiesObject = {
		tenant_info: {
			name: properties["Nome do Locatário"],
			nacionality: "Brasileiro",
			cpf: properties["Cpf do Locatário"],
			rg: properties["RG do Locatário"],
			job: "Pedreiro",
			email: properties["E-mail Locatário"],
		},
		landlord_info: {
			name: properties["Nome completo do proprietário"],
			nacionality: "Brasileiro",
			cpf: properties["Cpf do Proprietário"],
			rg: properties[" RG do Proprietario"],
			job: "Pedreiro",
			email: properties["E-mail proprietário"],
		},
		property_info: {
			street: properties["Endereço do Imóvel"],
			date_start: properties["Data de inicio da Locação"],
			date_finish: "2026-12-05T00:00:00.000Z",
			rental_value: properties["Valor Proposto para locação"],
			condomium_value: properties["Valor do condominio"],
			iptu_value: properties["Valo do IPTU"]
		}
	};

	async function getDocumentByType(documents: RequestBodyDocuments[], documentType: string) {
		const document = documents.find(data => data.name === documentType);
		if (document) {
			return getDocuments(document.document_id);
		}
		return null;
	}

	const tenantDocument = await getDocumentByType(documents, "RG e CPF ou CNH - Locatário");
	const propertyDocument = await getDocumentByType(documents, "RG e CPF ou CNH - Proprietário ");
  
	const binaryDataTenant = await saveDocument(tenantDocument.url);
	const binaryDataProperty = await saveDocument(propertyDocument.url);
    
	const prompt = `
  Locatário:
    Nome: ${propertiesObject.tenant_info.name}
    Nacionalidade: ${propertiesObject.tenant_info.nacionality}
    Cpf: ${propertiesObject.tenant_info.cpf}
    RG: ${propertiesObject.tenant_info.rg}
    Profissão: ${propertiesObject.tenant_info.job}
    Email: ${propertiesObject.tenant_info.email}

  Proprietário:
    Nome: ${propertiesObject.landlord_info.name}
    Nacionalidade: ${propertiesObject.landlord_info.nacionality}
    Cpf: ${propertiesObject.landlord_info.cpf}
    RG: ${propertiesObject.landlord_info.rg}
    Profissão: ${propertiesObject.landlord_info.job}
    Email: ${propertiesObject.landlord_info.email}

  Imóvel:
    Rua: ${propertiesObject.property_info.street}
    Data de inicio da locação: ${propertiesObject.property_info.date_start}
    Data de termino da locação: ${propertiesObject.property_info.date_finish}
    Valor da locação: ${propertiesObject.property_info.rental_value}
    Valor do condominio: ${propertiesObject.property_info.condomium_value}
    Valor do IPTU: ${propertiesObject.property_info.iptu_value}
  `;

	await chatGenerate(prompt, binaryDataTenant, binaryDataProperty).then((response) => {
		res.send(response);
	});

	return res.send(prompt);
});