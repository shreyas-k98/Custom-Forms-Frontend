import { useState } from "react";
import "../../Styles/style.css";
import { AxiosResponse } from "axios";
import { LinkIcon } from "../../assets/Link";
import { getFormResponses, successAlert } from "../../Helpers/helper";
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
    successAlert("Copied link to clipboard");
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
          width: "362px",
          height: "150px",
        }}
        className="uplift"
      >
        <CardBody>
          <CardTitle tag={"h5"}>{form_title?.length > 23 ? `${form_title?.slice(0, 23)}...` : form_title}</CardTitle>
          <CardSubtitle tag={"h6"} className="mb-2 text-muted">
            {`Created At: ${new Date(created_at)?.toLocaleDateString()}`}
          </CardSubtitle>
          <div className="d-flex justify-content-between" style={{marginTop: "10%"}}>
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
            <Button color="primary" onClick={onClickCopyLink} className="d-flex align-items-center">
              <span>{"Copy Link"}</span>
              <LinkIcon className="ms-2"/>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
