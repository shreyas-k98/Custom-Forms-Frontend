import { Context, createContext } from "react";
import { GenericContextInterface } from "../../Interfaces/interfaces";
import { noop } from "../../Helpers/helper";

export const GenericContext: Context<GenericContextInterface> =
  createContext<GenericContextInterface>({
    session: { user_id: null },
    setSession: noop,
    customForms: [],
    setCustomForms: noop,
  });
