import { Button, Spinner } from "reactstrap";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  SessionDataInterface,
  GenericContextInterface,
  JsonObject,
  CustomFormPayload,
  CustomFormInterface,
  CustomFormFields,
} from "../Interfaces/interfaces";
import { GenericContext } from "./Context/SessionContext";
import { NavigateFunction, useNavigate } from "react-router";
import { addCustomForm, getSessionData, noop } from "../Helpers/helper";
import Dropdown from "react-multilevel-dropdown";
import { NavBar } from "./Reusable/NavBar";
import { RemoveIcon } from "../assets/Remove";
import { InputBox } from "./Reusable/InputBox";
import { NoDataFound } from "../assets/NoData";

export const CreateCustomForm = (): React.ReactNode => {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const {
    session,
    setSession,
    customForms = [],
    setCustomForms = noop,
  } = genericContext;
  const navigate: NavigateFunction = useNavigate();
  const [items, setItems] = useState<JsonObject[]>([]);
  const [inputIds, setInputIds] = useState<string[]>([]);
  const [selectedInputField, setSelectedInputField] = useState<JsonObject>({});
  const [formTitle, setformTitle] = useState<string>("");
  const [addRadioOption, setAddRadioOption] = useState<{
    [key: string]: string;
  }>({ value: "", label: "" });
  const [saveFormLoading, setSaveFormLoading] = useState<boolean>(false);
  const inputTypes: string[] = ["Text Input", "Radio Input"];

  const fetchSessionData = async (): Promise<void> => {
    if (!!session?.user_id) return;
    const sessionData: Awaited<SessionDataInterface> = await getSessionData();
    setSession(sessionData);
    if (!!sessionData?.user_id) return;
    navigate("/");
  };

  useEffect((): void => {
    fetchSessionData();
  }, []);

  useEffect((): void => {
    setSelectedInputField(items?.at(-1) || {});
  }, [items?.length]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    const draggedOverItem: JsonObject = items[index];
    if (draggedItem === draggedOverItem) {
      return;
    }
    let itemsCopy: JsonObject[] = items.filter((item) => item !== draggedItem);
    itemsCopy.splice(index, 0, draggedItem);
    setItems(itemsCopy);
  };

  const handleDrop = (): void => {
    setDraggedItem(null);
  };

  const handleInputTypeSelection = (item: string): void => {
    const id: string = uuidv4();
    const selectedInputMeta: JsonObject = {
      id: id,
      inputFieldTitle: "",
    };
    if (item === "Text Input") {
      selectedInputMeta.input = "text";
      setInputIds([...inputIds, id]);
      setItems([...items, selectedInputMeta]);
      setSelectedInputField(selectedInputMeta);
    }
    if (item === "Radio Input") {
      selectedInputMeta.input = "radio";
      selectedInputMeta.options = [];
      setInputIds([...inputIds, id]);
      setItems([...items, selectedInputMeta]);
      setSelectedInputField(selectedInputMeta);
    }
  };

  const removeInputField = (removedItem: JsonObject): void => {
    const filteredItems: JsonObject[] =
      items?.filter(
        (item: JsonObject): boolean => item?.id !== removedItem?.id
      ) || [];
    setItems(filteredItems);
  };

  const validate = (): boolean => {
    const failureAlert: Function = toast.error;
    if (!formTitle) {
      failureAlert("Form title is mandatory");
      return false;
    }
    if (!items?.length) {
      failureAlert("At least one field is required to create form");
      return false;
    }
    let isValid: boolean = true;
    for (let index: number = 0; index < items.length; index++) {
      const item: JsonObject = items?.[index];
      if (item?.input === "text" && !item?.inputFieldTitle) {
        failureAlert(`Title is missing for field number : ${index + 1}`);
        isValid = false;
        break;
      }
      if (item?.input === "radio" && !item?.inputFieldTitle) {
        failureAlert(`Title is missing for field number : ${index + 1}`);
        isValid = false;
        break;
      }
      if (item?.input === "radio" && !item?.options?.length) {
        failureAlert(
          `At least one option is required for field number : ${index + 1}`
        );
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const preparePayload = (): CustomFormPayload => {
    const payload: CustomFormPayload = {
      form_title: formTitle,
      fields: [],
    };
    items?.forEach((item: JsonObject, index: number): void => {
      const field: CustomFormFields = {
        field_name: item?.inputFieldTitle || "-",
        field_type: item?.input || "text",
        order: index + 1,
      };
      if (item?.input === "radio") {
        field.options = item?.options || [];
      }
      payload?.fields?.push(field);
    });
    return payload;
  };

  const saveFormData = async (): Promise<void> => {
    if (!validate()) return;
    setSaveFormLoading(true);
    const payload: CustomFormPayload = preparePayload();
    const createdForm: Awaited<CustomFormInterface> =
      await addCustomForm(payload);
    setSaveFormLoading(false);
    if (!!createdForm?.form_id) {
      setCustomForms([...customForms, createdForm]);
      toast.success("New Form Added Successfully !!");
      navigate("/forms/home");
      return;
    }
    toast.error("Failed to create form");
    return;
  };

  const formInputDropDown = (): JSX.Element => {
    return (
      <div className="w-100 d-flex align-items-center justify-content-between mt-3 mb-3 pe-3">
        <InputBox
          type={"text"}
          className="w-25 ms-4"
          value={formTitle}
          isDisabled={false}
          id={"form-title-input"}
          placeholder={"Enter Form Title"}
          onChange={(value: string): void => setformTitle(value)}
        />
        <div>
          <Button
            id={"save-form"}
            className="btn btn-success me-4"
            onClick={saveFormData}
          >
            <>
              {"Save form"}
              {saveFormLoading && (
                <Spinner
                  className="ms-2"
                  id={"loading-spinner"}
                  size={"sm"}
                  color="light"
                  type="border"
                />
              )}
            </>
          </Button>
          <Dropdown
            position={"left"}
            openOnHover={false}
            title={"Add Form Input"}
            buttonVariant={"primary"}
            menuClassName={"primary"}
            buttonClassName=""
          >
            {inputTypes?.map((item: string): JSX.Element => {
              return (
                <Dropdown.Item
                  onClick={(): void => handleInputTypeSelection(item)}
                >
                  {item}
                </Dropdown.Item>
              );
            })}
          </Dropdown>
        </div>
      </div>
    );
  };

  const dragDropComponent = () => {
    return (
      <div className="w-25 vh-100 border-end ms-4">
        <div className="pt-4 mb-3 fs-4 ms-2">{"Form Fields"}</div>
        <div className="row w-100 border-top">
          <div className="col-md-12 mt-3">
            {!!items?.length ? (
              items?.map(
                (item: JsonObject, index: number): JSX.Element => (
                  <div
                    draggable
                    key={item.id}
                    onDrop={handleDrop}
                    onDragEnd={handleDrop}
                    style={{ cursor: "move", height: "75px" }}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onClick={(): void => setSelectedInputField(item)}
                    className={`card p-1 mb-3 ${item?.id === selectedInputField?.id ? "bg-secondary text-white" : "bg-light"}`}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-grid ms-2 mt-2">
                        <span className="">
                          {(item?.inputFieldTitle?.length > 23
                            ? item?.inputFieldTitle?.slice(0, 22) + "..."
                            : item?.inputFieldTitle) || "-"}
                        </span>
                        <span className="fs-6 fw-light">{`input type : ${item?.input}`}</span>
                      </div>
                      <RemoveIcon
                        onClick={(): void => removeInputField(item)}
                        style={{ cursor: "pointer" }}
                        className="cursor-pointer mt-2 me-1"
                      />
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="w-100 h-100">
                <span className="w-100 h-100 mt-5 pt-5">{"No Data Found"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const updateInputFieldTitle = (value: string): void => {
    setSelectedInputField({ ...selectedInputField, inputFieldTitle: value });
    items?.forEach((item: JsonObject): void => {
      if (item?.id === selectedInputField?.id) {
        item.inputFieldTitle = value;
      }
    });
  };

  const onClickAddOption = (): void => {
    if (!addRadioOption?.label || !addRadioOption?.value) {
      toast.error("Value and label is required");
      return;
    }
    const options: JsonObject[] = selectedInputField?.options || [];
    const optionMeta: JsonObject = {
      value: addRadioOption?.value,
      label: addRadioOption?.label,
      order: options?.length + 1,
    };
    options.push(optionMeta);
    setSelectedInputField({ ...selectedInputField });
    setAddRadioOption({ label: "", value: "" });
  };

  const renderSelectedInputFields = (): JSX.Element => {
    return (
      <div
        className={`ms-4 w-100 ${!selectedInputField?.id ? "h-100" : "h-75"}`}
      >
        {!selectedInputField?.id && (
          <div className="d-flex align-items-center fs-2 flex-column mt-5">
            <span>{"No fields added"}</span>
            <NoDataFound />
          </div>
        )}
        {selectedInputField?.input === "text" && (
          <div className="d-grid align-items-center">
            <span className="fw-bold me-3">{"Enter Input Title : "}</span>
            <InputBox
              type={"text"}
              className="w-50"
              isDisabled={false}
              placeholder={"Enter Title"}
              id={selectedInputField?.id}
              value={selectedInputField?.inputFieldTitle}
              onChange={(value: string): void => updateInputFieldTitle(value)}
            />
          </div>
        )}
        {selectedInputField?.input === "radio" && (
          <div className="d-grid align-items-center">
            <span className="fw-bold me-3">{"Enter Input Title : "}</span>
            <InputBox
              type={"text"}
              className="w-50"
              isDisabled={false}
              placeholder={"Enter Title"}
              id={selectedInputField?.id}
              value={selectedInputField?.inputFieldTitle}
              onChange={(value: string): void => updateInputFieldTitle(value)}
            />
            <div className="w-100">
              <span className="fw-bold me-3">{"Enter Radio label : "}</span>
              <InputBox
                type={"text"}
                className="w-25"
                isDisabled={false}
                placeholder={"Enter Label"}
                id={selectedInputField?.id}
                value={addRadioOption?.label}
                onChange={(value: string): void =>
                  setAddRadioOption({ ...addRadioOption, label: value })
                }
              />
              <span className="fw-bold me-3 ms-3">
                {"Enter Radio value : "}
              </span>
              <InputBox
                type={"text"}
                className="w-25"
                isDisabled={false}
                placeholder={"Enter Value"}
                id={selectedInputField?.id}
                value={addRadioOption?.value}
                onChange={(value: string): void =>
                  setAddRadioOption({ ...addRadioOption, value: value })
                }
              />
              <Button
                id={`add-option-btn`}
                className="ms-4 btn btn-success h-75 mb-2"
                onClick={onClickAddOption}
              >
                {"Add"}
              </Button>
              {!!selectedInputField?.options?.length && (
                <div className="mt-4 ms-5">
                  {selectedInputField?.options?.map(
                    (item: JsonObject): JSX.Element => {
                      return (
                        <div className="w-100 h-100">
                          <input
                            type={"radio"}
                            name={selectedInputField?.id}
                          ></input>
                          <span className="ms-3 fw-bold">
                            {item?.label || ""}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      {formInputDropDown()}
      <div className="border-top vh-100 w-100 border-right d-flex align-items-center">
        {dragDropComponent()}
        {renderSelectedInputFields()}
      </div>
    </div>
  );
};
