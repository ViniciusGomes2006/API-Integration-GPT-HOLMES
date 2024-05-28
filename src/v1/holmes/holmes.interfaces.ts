export interface ActionDetails {
  id: string;
  name: string;
}

export interface userIdentification {
  name: string
  nationality: string
  identification: string
  cpf: string | ""
  job: string
  marital_status: string,
  email: string | ""
}
export interface userInfoProperties {
  address: string | ""
  city: string | ""
  neighborhood : string | ""
  state: string | ""
  zip_code: string | ""
}

export interface userProperty {
  user_info: userIdentification
  user_location: userInfoProperties
}

export interface TaskProperty extends ActionDetails {
  value: string;
}

export interface Task {
  action_id: string;
  property_values: {
    id: string;
    value: string;
  }[];
  confirm_action: boolean;
}