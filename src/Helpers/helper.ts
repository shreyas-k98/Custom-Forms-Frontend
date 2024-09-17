import axios, { AxiosResponse } from "axios";
import {
  CustomFormInterface,
  CustomFormPayload,
  JsonObject,
  SessionDataInterface,
  SignupDataInterface,
} from "../Interfaces/interfaces";

export const noop = () => {};

export const getCSRFToken = (): string | null => {
  const name: string = "csrftoken=";
  const decodedCookies: string = decodeURIComponent(document.cookie);
  const cookiesArray: string[] = decodedCookies.split("; ");
  for (let cookie of cookiesArray) {
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

export const login = async (
  username: string | undefined,
  password: string | undefined
): Promise<SessionDataInterface> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.post(
      `/api/user/login`,
      {
        username: username || "",
        password: password || "",
      }
    );
    return response?.data?.session;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
    throw error;
  }
};

export const signup = async (
  payload: SignupDataInterface
): Promise<boolean> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.post(
      `/api/user/new`,
      payload
    );
    return !!response?.data?.message;
  } catch (error: unknown) {
    return false;
  }
};

export const getSessionData = async (): Promise<SessionDataInterface> => {
  try {
    const response: Awaited<AxiosResponse> =
      await axios.get("/api/data/session");
    return response?.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const logout = async (): Promise<JsonObject> => {
  try {
    const response: Awaited<AxiosResponse> =
      await axios.get(`/api/user/logout`);
    return response?.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllFormsForUser = async (): Promise<CustomFormInterface> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.get(`/api/forms/all`);
    return response?.data?.forms;
  } catch (error: unknown) {
    throw error;
  }
};

export const addCustomForm = async (
  payload: CustomFormPayload
): Promise<CustomFormInterface> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.post(
      `/api/form/new`,
      payload,
      { headers: { "X-CSRFToken": getCSRFToken() } }
    );
    return response?.data?.form;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCustomFormMeta = async (
  formId: string
): Promise<CustomFormPayload> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.get(
      `/api/form/${formId}`
    );
    return response?.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const submitFormResponse = async (
  formId: number | string,
  payload: JsonObject
): Promise<boolean> => {
  try {
    const response: Awaited<AxiosResponse> = await axios.post(
      `/api/form/${formId}/submit`,
      payload,
      { headers: { "X-CSRFToken": getCSRFToken() } }
    );
    return !!response?.data?.message;
  } catch (error: unknown) {
    return false;
  }
};

export const getFormResponses = async (
  formId: number | string | null
): Promise<AxiosResponse> => {
  try {
    const response: Awaited<AxiosResponse> = await axios({
      url: `/api/form/${formId}/responses`,
      method: "GET",
      responseType: "blob",
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};
