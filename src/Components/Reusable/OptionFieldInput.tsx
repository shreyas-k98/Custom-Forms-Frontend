import { useState } from "react";
import { Button } from "reactstrap";
import { InputBox } from "./InputBox";
import { failureAlert } from "../../Helpers/helper";
import { JsonObject } from "../../Interfaces/interfaces";

interface Props {
  fieldType: string;
  selectedInputField: JsonObject;
  setSelectedInputField: Function;
  updateInputFieldTitle: Function;
}

export const OptionFieldInput = (props: Props): React.ReactNode => {
  const {
    selectedInputField,
    setSelectedInputField,
    updateInputFieldTitle,
    fieldType = "",
  } = props;
  const [addRadioOption, setAddRadioOption] = useState<{
    [key: string]: string;
  }>({ value: "", label: "" });

  const onClickAddOption = (): void => {
    if (!addRadioOption?.label || !addRadioOption?.value) {
      failureAlert("Value and label is required");
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
  return (
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
      <div className="w-100">
        <span className="fw-bold me-3">{"Enter option label : "}</span>
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
        <span className="fw-bold me-3 ms-3">{"Enter option value : "}</span>
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
                      type={fieldType}
                      name={selectedInputField?.id}
                    ></input>
                    <span className="ms-3 fw-bold">{item?.label || ""}</span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
