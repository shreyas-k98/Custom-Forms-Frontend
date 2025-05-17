import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  GenericContextInterface,
  JsonObject,
  CustomFormPayload,
  CustomFormInterface,
  CustomFormFields,
} from "../Interfaces/interfaces";
import { NavBar } from "./Reusable/NavBar";
import { NoDataFound } from "../assets/NoData";
import { InputBox } from "./Reusable/InputBox";
import { useSession } from "../Hooks/useSession";
import { OptionFieldInput } from "./Reusable/OptionFieldInput";
import { INPUT_FIELD_TYPE_LABEL, INPUT_FIELD_TYPES } from "../Helpers/enums";
import {
  addCustomForm,
  noop,
  successAlert,
  failureAlert,
} from "../Helpers/helper";
import { GenericContext } from "./Context/SessionContext";
import { NavigateFunction, useNavigate } from "react-router";
import { InputFieldsDropDown } from "./Reusable/InputFieldsDropDown";
import { FormSideBar } from "./Reusable/FormSideBar";

export const CreateCustomForm = (): React.ReactNode => {
  useSession();
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const { customForms = [], setCustomForms = noop } = genericContext;
  const navigate: NavigateFunction = useNavigate();
  const [items, setItems] = useState<JsonObject[]>([]);
  const [inputIds, setInputIds] = useState<string[]>([]);
  const [formTitle, setformTitle] = useState<string>("");
  const [saveFormLoading, setSaveFormLoading] = useState<boolean>(false);
  const [selectedInputField, setSelectedInputField] = useState<JsonObject>({});

  useEffect((): void => {
    setSelectedInputField(items?.at(-1) || {});
  }, [items?.length]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.preventDefault();
    const draggedOverItem: JsonObject = items[index];
    if (draggedItem === draggedOverItem) {
      return;
    }
    let itemsCopy: JsonObject[] = items.filter((item) => item !== draggedItem);
    itemsCopy.splice(index, 0, draggedItem);
    setItems(itemsCopy);
  };

  const handleDrop = (): void => setDraggedItem(null);

  const handleInputTypeSelection = (item: string): void => {
    const id: string = uuidv4();
    const selectedInputMeta: JsonObject = {
      id: id,
      inputFieldTitle: "",
    };
    setInputIds([...inputIds, id]);
    setItems([...items, selectedInputMeta]);
    setSelectedInputField(selectedInputMeta);
    if (item === INPUT_FIELD_TYPE_LABEL.TEXT) {
      selectedInputMeta.input = INPUT_FIELD_TYPES.TEXT;
    }
    if (item === INPUT_FIELD_TYPE_LABEL.RADIO) {
      selectedInputMeta.options = [];
      selectedInputMeta.input = INPUT_FIELD_TYPES.RADIO;
    }
    if (item === INPUT_FIELD_TYPE_LABEL.CHECKBOX) {
      selectedInputMeta.options = [];
      selectedInputMeta.input = INPUT_FIELD_TYPES.CHECKBOX;
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
      if (item?.input === INPUT_FIELD_TYPES.TEXT && !item?.inputFieldTitle) {
        failureAlert(`Title is missing for field number : ${index + 1}`);
        isValid = false;
        break;
      }
      if (item?.input === INPUT_FIELD_TYPES.RADIO && !item?.inputFieldTitle) {
        failureAlert(`Title is missing for field number : ${index + 1}`);
        isValid = false;
        break;
      }
      if (item?.input === INPUT_FIELD_TYPES.RADIO && !item?.options?.length) {
        failureAlert(
          `At least one option is required for field number : ${index + 1}`
        );
        isValid = false;
        break;
      }
      if (
        item?.input === INPUT_FIELD_TYPES.CHECKBOX &&
        !item?.options?.length
      ) {
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
        field_type: item?.input || INPUT_FIELD_TYPES.TEXT,
        order: index + 1,
      };
      if (
        [INPUT_FIELD_TYPES.RADIO, INPUT_FIELD_TYPES.CHECKBOX]?.includes(
          item?.input
        )
      ) {
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
      successAlert("New Form Added Successfully !!");
      navigate("/forms/home");
      return;
    }
    failureAlert("Failed to create form");
    return;
  };

  const updateInputFieldTitle = (value: string): void => {
    setSelectedInputField({ ...selectedInputField, inputFieldTitle: value });
    items?.forEach((item: JsonObject): void => {
      if (item?.id === selectedInputField?.id) {
        item.inputFieldTitle = value;
      }
    });
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
        {selectedInputField?.input === INPUT_FIELD_TYPES.TEXT && (
          <div className="d-grid align-items-center">
            <span className="fw-bold me-3">{"Enter Field Title : "}</span>
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
        {selectedInputField?.input === INPUT_FIELD_TYPES.RADIO && (
          <OptionFieldInput
            fieldType={INPUT_FIELD_TYPES.RADIO}
            selectedInputField={selectedInputField}
            updateInputFieldTitle={updateInputFieldTitle}
            setSelectedInputField={setSelectedInputField}
          />
        )}
        {selectedInputField?.input === INPUT_FIELD_TYPES.CHECKBOX && (
          <OptionFieldInput
            fieldType={INPUT_FIELD_TYPES.CHECKBOX}
            selectedInputField={selectedInputField}
            updateInputFieldTitle={updateInputFieldTitle}
            setSelectedInputField={setSelectedInputField}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      <InputFieldsDropDown
        formTitle={formTitle}
        setformTitle={setformTitle}
        saveFormData={saveFormData}
        saveFormLoading={saveFormLoading}
        inputTypes={Object.values(INPUT_FIELD_TYPE_LABEL)}
        handleInputTypeSelection={handleInputTypeSelection}
      />
      <div className="border-top vh-100 w-100 border-right d-flex align-items-center">
        <FormSideBar
          items={items}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          removeInputField={removeInputField}
          selectedInputField={selectedInputField}
          setSelectedInputField={setSelectedInputField}
        />
        {renderSelectedInputFields()}
      </div>
    </div>
  );
};
