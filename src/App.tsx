import { useState } from "react";
import "./Styles/style.css";
import { Toaster } from "react-hot-toast";
import { Home } from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { SubmitForm } from "./Components/SubmitForm";
import { CreateCustomForm } from "./Components/NewForm";
import { LoginAndSignup } from "./Components/LoginSignup";
import { HashRouter, Route, Routes } from "react-router-dom";
import { GenericContext } from "./Components/Context/SessionContext";
import {
  CustomFormInterface,
  SessionDataInterface,
} from "./Interfaces/interfaces";

export const App = (): JSX.Element => {
  const [customForms, setCustomForms] = useState<CustomFormInterface[]>([]);
  const [session, setSession] = useState<SessionDataInterface>({
    user_id: null,
  });

  return (
    <>
      <GenericContext.Provider
        value={{ session, setSession, customForms, setCustomForms }}
      >
        <Toaster />
        <HashRouter basename="/">
          <Routes>
            <Route path="/" Component={LoginAndSignup} />
            <Route path="/forms/home" Component={Home} />
            <Route path="/form/new" Component={CreateCustomForm} />
            <Route path="/submit/form/:id" Component={SubmitForm} />
          </Routes>
        </HashRouter>
      </GenericContext.Provider>
    </>
  );
};
