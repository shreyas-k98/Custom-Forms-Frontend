import { RemoveIcon } from "../../assets/Remove";
import { JsonObject } from "../../Interfaces/interfaces";

interface Props {
  items: JsonObject;
  handleDragOver: Function;
  handleDragStart: Function;
  removeInputField: Function;
  selectedInputField: JsonObject;
  setSelectedInputField: Function;
  handleDrop: React.DragEventHandler<HTMLDivElement>;
}

export const FormSideBar = (props: Props) => {
  const {
    items,
    handleDrop,
    handleDragOver,
    handleDragStart,
    removeInputField,
    selectedInputField,
    setSelectedInputField,
  } = props;
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
