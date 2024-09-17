import { NavigateFunction, useNavigate, useParams } from "react-router";
import { NavBar } from "./Reusable/NavBar";
import { useContext, useEffect, useState } from "react";
import {
  CustomFormFields,
  CustomFormPayload,
  CustomFormRadioOptions,
  GenericContextInterface,
  JsonObject,
  SessionDataInterface,
} from "../Interfaces/interfaces";
import {
  getCustomFormMeta,
  getSessionData,
  submitFormResponse,
} from "../Helpers/helper";
import { GenericContext } from "./Context/SessionContext";
import { Button, Spinner } from "reactstrap";
import { InputBox } from "./Reusable/InputBox";
import toast from "react-hot-toast";

export const SubmitForm = (): React.ReactNode => {
  const { id = "" } = useParams();
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const { session, setSession } = genericContext;
  const navigate: NavigateFunction = useNavigate();
  const formId: string = atob(id);
  const [customForm, setCustomForm] = useState<CustomFormPayload | null>(null);
  const [userResponse, setUserResponse] = useState<JsonObject[]>([]);
  const [isResponseSubmitted, setIsResponseSubmitted] =
    useState<boolean>(false);

  const fetchSessionData = async (): Promise<void> => {
    if (!!session?.user_id) return;
    const sessionData: Awaited<SessionDataInterface> = await getSessionData();
    setSession(sessionData);
    if (!!sessionData?.user_id) return;
    navigate("/");
  };

  const getInitialForm = async (): Promise<void> => {
    const data: Awaited<CustomFormPayload> = await getCustomFormMeta(formId);
    setCustomForm(data);
  };

  useEffect((): void => {
    getInitialForm();
    fetchSessionData();
  }, []);

  const updateInputValues = (
    value: string | number = "",
    item: CustomFormFields
  ): void => {
    const filteredField: JsonObject | undefined = userResponse?.find(
      (itr: JsonObject): boolean => itr?.id === item?.field_id
    );
    if (filteredField) {
      filteredField.value = value;
      return;
    }
    const field: JsonObject = {
      value: value,
      id: item?.field_id,
      input_type: item?.field_type,
    };
    setUserResponse([...userResponse, field]);
  };

  const prepareFormPayload = (): JsonObject => {
    const payload: JsonObject = { fields: [] };
    userResponse?.map((item: JsonObject): void => {
      const field: JsonObject = {};
      if (item?.input_type === "text") {
        field.id = item?.id;
        field.response_text = item?.value;
      }
      if (item?.input_type === "radio") {
        field.id = item?.id;
        field.option_id = item?.value;
      }
      payload?.fields?.push(field);
    });
    return payload;
  };

  const handleSubmitForm = async (): Promise<void> => {
    const payload: JsonObject = prepareFormPayload();
    const response: Awaited<boolean> = await submitFormResponse(
      formId,
      payload
    );
    if (response) {
      setIsResponseSubmitted(true);
      toast.success("Response submitted successfully");
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-100 h-100 d-flex">
        {!isResponseSubmitted ? (
          <>
            {!!customForm?.form_id ? (
              <div className="d-flex align-items-center justify-content-center h-100 w-100 mt-3 flex-column">
                <div className="w-75 p-2 fw-bold fs-1 p-1 border-bottom d-flex justify-content-center">
                  {customForm?.form_title || "-"}
                </div>
                <div className="w-75">
                  {customForm?.fields &&
                    customForm?.fields?.map(
                      (item: CustomFormFields, index: number): JSX.Element => {
                        return (
                          <>
                            {item?.field_type === "text" && (
                              <div className="p-1 d-flex flex-column align-items-center justify-content-center w-100 mt-4 border-bottom">
                                <span className="w-50 ms-5 fw-bold">
                                  {item?.field_name || "-"}
                                </span>
                                <InputBox
                                  className="w-50 ms-5 mb-4"
                                  isDisabled={false}
                                  onChange={(value: string) =>
                                    updateInputValues(value, item)
                                  }
                                  type={item?.field_type}
                                  id={`input-field-${index}`}
                                  placeholder={item?.field_name}
                                />
                              </div>
                            )}
                            {item?.field_type === "radio" && (
                              <div className="p-1 d-flex flex-column align-items-center justify-content-center w-100 mt-4 border-bottom">
                                <span className="w-50 ms-5 mb-2 fw-bold">
                                  {item?.field_name || "-"}
                                </span>
                                <div className="mb-3 w-50 d-flex flex-column align-items-center justify-content-start">
                                  {item?.options?.map(
                                    (
                                      itr: CustomFormRadioOptions,
                                      index: number
                                    ): JSX.Element => {
                                      return (
                                        <div
                                          id={`radio-input-id-${index}`}
                                          className="ms-5 ps-2 w-100 d-flex align-items-center justify-content-start"
                                        >
                                          <input
                                            type="radio"
                                            name={item?.field_name || ""}
                                            onChange={() =>
                                              updateInputValues(
                                                itr?.option_id || 0,
                                                item
                                              )
                                            }
                                          ></input>
                                          <span className="w-50 ms-3">
                                            {itr?.option_lable}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      }
                    )}
                  <div className="w-100 mt-3 d-flex align-items-center justify-content-center ms-4 mb-4">
                    <div className="w-50">
                      <Button
                        id={`submit-form`}
                        color="success"
                        onClick={handleSubmitForm}
                      >
                        {"Submit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 w-100 mt-3">
                <Spinner
                  className="ms-5"
                  id={"loading-spinner"}
                  size={""}
                  color="dark"
                  type="border"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center h-100 w-100 mt-4 flex-column">
              <div className="w-75 p-2 fw-bold fs-1 p-3 d-flex justify-content-center">
                <span>{"Thank You for submitting the response"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
