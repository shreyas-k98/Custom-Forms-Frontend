import { useParams } from "react-router";
import { NavBar } from "./Reusable/NavBar";
import { useEffect, useState } from "react";
import {
  JsonObject,
  CustomFormFields,
  CustomFormPayload,
} from "../Interfaces/interfaces";
import {
  getCustomFormMeta,
  submitFormResponse,
  successAlert,
} from "../Helpers/helper";
import { Button, Spinner } from "reactstrap";
import { InputBox } from "./Reusable/InputBox";
import { useSession } from "../Hooks/useSession";
import { INPUT_FIELD_TYPES } from "../Helpers/enums";
import { RenderRadioField } from "./Reusable/RenderRadioField";

export const SubmitForm = (): React.ReactNode => {
  useSession();
  const { id = "" } = useParams();
  const formId: string = atob(id);
  const [customForm, setCustomForm] = useState<CustomFormPayload | null>(null);
  const [userResponse, setUserResponse] = useState<JsonObject[]>([]);
  const [isResponseSubmitted, setIsResponseSubmitted] =
    useState<boolean>(false);

  const getInitialForm = async (): Promise<void> => {
    const data: Awaited<{ [key: string]: CustomFormPayload }> =
      await getCustomFormMeta(formId);
    setCustomForm(data?.form || data || {});
  };

  useEffect((): void => {
    getInitialForm();
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
      successAlert("Response submitted successfully");
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
                            {item?.field_type === INPUT_FIELD_TYPES.TEXT && (
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
                            {item?.field_type === INPUT_FIELD_TYPES.RADIO && (
                              <RenderRadioField
                                formItem={item}
                                updateInputValues={updateInputValues}
                              />
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
