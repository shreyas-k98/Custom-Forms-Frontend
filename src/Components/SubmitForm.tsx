import "../Styles/style.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavBar } from "./Reusable/NavBar";
import {
  CustomFormFields,
  CustomFormPayload,
  FormResponse,
} from "../Interfaces/interfaces";
import {
  failureAlert,
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
  const [formResponse, setFormResponse] = useState<{
    [key: number]: Partial<FormResponse>;
  }>({});
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
    item: CustomFormFields,
    isSelected: boolean = false
  ): void => {
    console.log({ value, item, isSelected });
    const fieldId: number = item?.field_id || 0;
    const fieldType: string = item?.field_type || "";
    if (fieldType === INPUT_FIELD_TYPES.TEXT) {
      setFormResponse({
        ...formResponse,
        [fieldId]: {
          id: fieldId,
          response_text: value?.toString(),
          type: INPUT_FIELD_TYPES.TEXT,
        },
      });
    }
    if (fieldType === INPUT_FIELD_TYPES.RADIO) {
      setFormResponse({
        ...formResponse,
        [fieldId]: {
          id: fieldId,
          selected_option: Number(value),
          type: INPUT_FIELD_TYPES.RADIO,
        },
      });
    }
    if (fieldType === INPUT_FIELD_TYPES.CHECKBOX) {
      let selectedOptions: number[] = formResponse?.[fieldId]?.options || [];
      selectedOptions = isSelected
        ? [...new Set([...selectedOptions, Number(value)])]
        : selectedOptions?.filter((i: number): boolean => i !== value);
      setFormResponse({
        ...formResponse,
        [fieldId]: {
          id: fieldId,
          options: selectedOptions,
          type: INPUT_FIELD_TYPES.CHECKBOX,
        },
      });
    }
  };

  const prepareFormPayload = (): { [key: string]: Partial<FormResponse>[] } => {
    return { fields: Object.values(formResponse) };
  };

  const handleSubmitForm = async (): Promise<void> => {
    if (!Object.values(formResponse)?.length) {
      failureAlert("Cannot submit empty form");
    }
    const payload: { [key: string]: Partial<FormResponse>[] } =
      prepareFormPayload();
    const response: Awaited<boolean> = await submitFormResponse(
      formId,
      payload
    );
    if (response) {
      setIsResponseSubmitted(true);
      successAlert("Response submitted successfully");
      return;
    }
    failureAlert("Failed to submit response");
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
                                fieldType={INPUT_FIELD_TYPES.RADIO}
                                updateInputValues={updateInputValues}
                              />
                            )}
                            {item?.field_type ===
                              INPUT_FIELD_TYPES.CHECKBOX && (
                              <RenderRadioField
                                formItem={item}
                                fieldType={INPUT_FIELD_TYPES.CHECKBOX}
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
                <span className="create-new-form text-primary" onClick={(): void => window.location.reload()}>{"Submit another response"}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
