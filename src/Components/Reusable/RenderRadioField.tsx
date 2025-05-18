import {
  CustomFormFields,
  CustomFormRadioOptions,
} from "../../Interfaces/interfaces";

interface Props {
  fieldType: string;
  formItem: CustomFormFields;
  updateInputValues: Function;
}

export const RenderRadioField = (props: Props) => {
  const { formItem: item, updateInputValues, fieldType = "" } = props;
  return (
    <div className="p-1 d-flex flex-column align-items-center justify-content-center w-100 mt-4 border-bottom">
      <span className="w-50 ms-5 mb-2 fw-bold">{item?.field_name || "-"}</span>
      <div className="mb-3 w-50 d-flex flex-column align-items-center justify-content-start">
        {item?.options?.map(
          (itr: CustomFormRadioOptions, index: number): JSX.Element => {
            const optionId: string = `option-id-${itr?.option_id || 0}`
            return (
              <div
                id={`radio-input-id-${index}`}
                className="ms-5 ps-2 w-100 d-flex align-items-center justify-content-start"
              >
                <input
                  id={optionId}
                  type={fieldType}
                  name={item?.field_name || ""}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateInputValues(
                      itr?.option_id || 0,
                      item,
                      event?.target?.checked
                    )
                  }
                ></input>
                <label className="w-50 ms-3" htmlFor={optionId}>{itr?.option_lable || ""}</label>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
