import { useState } from "react";
import "../../Styles/style.css";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import { getFormResponses } from "../../Helpers/helper";
import { CustomFormInterface } from "../../Interfaces/interfaces";
import { Button, Card, CardBody, CardSubtitle, CardTitle, Spinner } from "reactstrap";

interface Props {
  customFormData: CustomFormInterface;
}

export const FormCard = (props: Props): React.ReactNode => {
  const { customFormData } = props;
  const { form_title = "", created_at = "", form_id = null } = customFormData;
  const [loading, setLoading] = useState<boolean>(false);

  const onClickCopyLink = async (): Promise<void> => {
    const formId: string = btoa(form_id?.toString() || "");
    const formLink: string = `${window.location.host}/#/submit/form/${formId}`;
    await navigator.clipboard.writeText(formLink);
    toast.success("Copied link to clipboard");
  };

  const onClickDownloadResponses = async (): Promise<void> => {
    setLoading(true);
    const response: Awaited<AxiosResponse> = await getFormResponses(form_id);
    setLoading(false);
    const blob: Blob = new Blob([response?.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${form_title} Responses.xls`;
    link.click();
  };

  return (
    <div>
      <Card
        color="light"
        style={{
          width: "345px",
          height: "150px",
        }}
        className="uplift"
      >
        <CardBody>
          <CardTitle tag={"h5"}>{form_title}</CardTitle>
          <CardSubtitle tag={"h6"} className="mb-2 text-muted">
            {`Created At: ${new Date(created_at)?.toLocaleDateString()}`}
          </CardSubtitle>
          <div className="d-flex justify-content-between mt-3">
            <Button color="success" outline={true} onClick={onClickDownloadResponses}>
              <>
                {"Download Responses"}
                {loading && (
                  <Spinner
                    className="ms-2"
                    id={"loading-spinner"}
                    size={"sm"}
                    color="succes"
                    type="border"
                  />
                )}
              </>
            </Button>
            <Button color="primary" onClick={onClickCopyLink}>
              {"Copy Link"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
