import { InputBox } from "./InputBox";
import { Button, Spinner } from "reactstrap";
import Dropdown from "react-multilevel-dropdown";
import { noop } from "../../Helpers/helper";

interface Props {
  formTitle: string;
  inputTypes: string[];
  setformTitle: Function;
  saveFormLoading: boolean;
  handleInputTypeSelection: Function;
  saveFormData: React.MouseEventHandler<HTMLButtonElement>;
}

export const InputFieldsDropDown = (props: Props): React.ReactNode => {
  const {
    formTitle,
    inputTypes,
    setformTitle = noop,
    saveFormData = noop,
    saveFormLoading = false,
    handleInputTypeSelection = noop,
  } = props;
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
          {inputTypes?.map((item: string, index: number): JSX.Element => {
            return (
              <Dropdown.Item
                onClick={(): void => handleInputTypeSelection(item)}
                key={`input-field-${index}`}
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
