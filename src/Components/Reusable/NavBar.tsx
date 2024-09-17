import { useContext } from "react";
import {
  JsonObject,
  GenericContextInterface,
} from "../../Interfaces/interfaces";
import { GenericContext } from "../Context/SessionContext";
import { NavigateFunction, useNavigate } from "react-router";
import { logout, noop } from "../../Helpers/helper";
import toast from "react-hot-toast";

export const NavBar = () => {
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const {
    session: user = { user_id: null },
    setSession = noop,
    setCustomForms = noop,
  } = genericContext;
  const navigate: NavigateFunction = useNavigate();

  const home = (): void => navigate("/forms/home");
  const newForm = (): void => navigate("/form/new");
  const handleLogout = async (): Promise<void> => {
    const data: Awaited<JsonObject> = await logout();
    if (!!data?.message) {
      setSession({});
      setCustomForms([]);
      navigate("/");
      toast.success("User logged out");
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div
        className="navbar-brand"
        style={{ cursor: "default", marginLeft: "10px" }}
        onClick={home}
      >
        {`Wellcome,  ${user?.first_name} ${user?.last_name}`}
      </div>
      <div
        className="collapse navbar-collapse d-flex align-items-center justify-content-between"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item active">
            <div
              className="nav-link"
              style={{ cursor: "pointer" }}
              onClick={newForm}
            >
              {"Create New"}
            </div>
          </li>
          <li className="nav-item active">
            <div
              className="nav-link"
              style={{ cursor: "pointer" }}
              onClick={home}
            >
              {"View All Forms"}
            </div>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item active">
            <div
              className="nav-link mr-3"
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={handleLogout}
            >
              {"Logout"}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};
