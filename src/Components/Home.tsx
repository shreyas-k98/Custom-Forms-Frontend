import { useContext, useEffect } from "react";
import { GenericContext } from "./Context/SessionContext";
import { NavBar } from "./Reusable/NavBar";
import {
  CustomFormInterface,
  GenericContextInterface,
  SessionDataInterface,
} from "../Interfaces/interfaces";
import { getAllFormsForUser, getSessionData } from "../Helpers/helper";
import { NavigateFunction, useNavigate } from "react-router";
import { FormCard } from "./Reusable/FormCard";
import "../Styles/style.css";

export const Home = (): React.ReactNode => {
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const { session, setSession, customForms, setCustomForms } = genericContext;
  const navigate: NavigateFunction = useNavigate();

  const fetchSessionData = async (): Promise<void> => {
    if (!!session?.user_id) return;
    const sessionData: Awaited<SessionDataInterface> = await getSessionData();
    setSession(sessionData);
    if (!!sessionData?.user_id) return;
    navigate("/");
  };

  const getAllForms = async (): Promise<void> => {
    if (!!customForms?.length) return;
    const forms: Awaited<CustomFormInterface> = await getAllFormsForUser();
    setCustomForms(forms);
    return;
  };

  const initialData = async (): Promise<void> => {
    fetchSessionData();
    getAllForms();
  };

  useEffect((): void => {
    initialData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-100 d-grid">
        <span className="w-100 mt-1 d-flex justify-content-center fs-2 border-bottom">
          {"All Forms"}
        </span>
        <div className="ms-5 ps-5 mt-3 card-container">
          {customForms?.length ? (
            customForms?.map((item: CustomFormInterface): JSX.Element => {
              return (
                <>
                  <FormCard customFormData={item} />
                </>
              );
            })
          ) : (
            <div className="w-100 d-grid">
              <span>
                {"No Forms Available, Please add forms by using "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/form/new");
                  }}
                >
                  {"Create New"}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
