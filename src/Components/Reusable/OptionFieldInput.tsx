import { useState } from "react";
import { Button, CloseButton, Table } from "reactstrap";
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

  const removeOption = (index: number): void => {
    const options: JsonObject[] = selectedInputField?.options || [];
    options.splice(index, 1);
    setSelectedInputField({ ...selectedInputField });
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
          <div className="mt-4 me-5">
            <Table bordered hover responsive striped>
              <thead>
                <th></th>
                <th>{"Label"}</th>
                <th>{"Value"}</th>
                <th></th>
              </thead>
              <tbody>
                {selectedInputField?.options?.map(
                  (item: JsonObject, index: number): JSX.Element => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{`${item?.label?.slice(0, 20)}${item?.label?.length > 20 ? "..." : ""}`}</td>
                        <td>{`${item?.value?.slice(0, 20)}${item?.value?.length > 20 ? "..." : ""}`}</td>
                        <td>
                          <CloseButton
                            className="h-25 w-25 d-flex mt-2"
                            onClick={(event: React.MouseEvent): void =>
                              removeOption(index)
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
