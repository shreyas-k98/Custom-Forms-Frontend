import { useContext, useEffect } from "react";
import { getSessionData, noop } from "../Helpers/helper";
import { NavigateFunction, useNavigate } from "react-router";
import { GenericContext } from "../Components/Context/SessionContext";
import { GenericContextInterface, SessionDataInterface } from "../Interfaces/interfaces";

export const useSession = (): void => {
    const navigate: NavigateFunction = useNavigate();
    const genericContext: GenericContextInterface = useContext<GenericContextInterface>(GenericContext);
    const { session, setSession = noop } = genericContext;

    const fetchSessionData = async (): Promise<void> => {
        if (!!session?.user_id) return;
        const sessionData: Awaited<SessionDataInterface> = await getSessionData();
        setSession(sessionData);
        if (!!sessionData?.user_id) return;
        navigate("/");
    };

    useEffect((): void => {
        fetchSessionData();
    }, [])
}