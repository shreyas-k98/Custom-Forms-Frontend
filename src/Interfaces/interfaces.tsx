export interface LoginCredentials {
  username: string | undefined;
  password: string | undefined;
}

export type JsonObject = { [key: string]: any };

export interface SignupDataInterface{
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SessionDataInterface {
  user_id: number | null;
  email?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
}

export interface CustomFormInterface {
  form_id: number | null;
  form_title: string;
  created_at: string;
}

export interface GenericContextInterface{
  session: SessionDataInterface;
  setSession: Function;
  customForms:  CustomFormInterface[];
  setCustomForms: Function;
}

export interface CustomFormRadioOptions {
  label: string;
  value: string;
  option_lable?: string;
  option_value?: string;
  option_id?: number;
}

export interface CustomFormFields {
  field_name: string;
  field_type: string;
  order: number;
  options?: CustomFormRadioOptions[];
  option_id?: number;
  field_id?: number;
}

export interface CustomFormPayload {
  form_id?: number;
  form_title: string;
  fields: CustomFormFields[];
}

export interface FormResponse{
  id: number;
  type: string;
  options: number[];
  response_text: string;
  selected_option: number;
}