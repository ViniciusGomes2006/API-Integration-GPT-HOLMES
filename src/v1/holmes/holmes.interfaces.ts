export interface ActionDetails {
  id: string;
  name: string;
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