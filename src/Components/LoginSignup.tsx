import { useContext, useEffect, useState } from "react";
import {
  getSessionData,
  login,
  signup,
  successAlert,
  failureAlert,
} from "../Helpers/helper";
import { InputBox } from "./Reusable/InputBox";
import {
  LoginCredentials,
  GenericContextInterface,
  SessionDataInterface,
  SignupDataInterface,
} from "../Interfaces/interfaces";
import { NavigateFunction, useNavigate } from "react-router";
import "../Styles/style.css";
import { GenericContext } from "./Context/SessionContext";

export const LoginAndSignup = (): JSX.Element => {
  const [isLoginActive, setIsLoginActive] = useState<boolean>(true);
  const genericContext: GenericContextInterface =
    useContext<GenericContextInterface>(GenericContext);
  const { setSession } = genericContext;
  const navigate: NavigateFunction = useNavigate();
  const [loginData, setLoginData] = useState<LoginCredentials>({
    username: undefined,
    password: undefined,
  });
  const [signUpData, setSignUpData] = useState<SignupDataInterface>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const initialData = async (): Promise<void> => {
    const data: Awaited<SessionDataInterface> = await getSessionData();
    setSession(data);
    !!data?.user_id && navigate("forms/home");
  };

  useEffect((): void => {
    initialData();
  }, []);

  const loginHandler = async (): Promise<void> => {
    const { username, password } = loginData;
    if (!username || !password) {
      failureAlert("Enter username and password");
      return;
    }
    const sessionResponse: Awaited<SessionDataInterface> = await login(
      username,
      password
    );
    if (!!sessionResponse?.user_id) {
      setSession(sessionResponse);
      successAlert("Successfully logged in");
      navigate("/forms/home");
    } else {
      failureAlert("Failed to login");
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignup = (): boolean => {
    const { name, email, username, password, confirmPassword } = signUpData;
    if (!(name && email && username && password && confirmPassword)) {
      failureAlert("All fields are mandatory");
      return false;
    }
    if (!validateEmail(email)) {
      failureAlert("Invalid email address");
      return false;
    }
    if (password !== confirmPassword) {
      failureAlert("Password dose not match");
    }
    return true;
  };

  const signUpHandler = async (): Promise<void> => {
    if (!validateSignup()) return;
    const response: Awaited<boolean> = await signup(signUpData);
    if (response) {
      successAlert("Successfully signed up");
      setIsLoginActive(true);
      return;
    }
    failureAlert("Failed to sign up");
    return;
  };

  return (
    <div className="login-signup-app">
      <div className="auth-container">
        <div className="toggle-buttons-wrapper">
          <span
            className={`toggle-button ${isLoginActive ? "active" : ""}`}
            onClick={() => setIsLoginActive(true)}
          >
            {"Login"}
          </span>
          <span
            className={`toggle-button ${!isLoginActive ? "active" : ""}`}
            onClick={() => setIsLoginActive(false)}
          >
            {"Sign Up"}
          </span>
        </div>
        <div
          className="auth-form-wrapper"
          style={{
            transform: isLoginActive ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          <div className="auth-form" id="login-form">
            <h2 className="auth-heading">{"Login"}</h2>
            <InputBox
              value={loginData?.username || ""}
              id={"login-username"}
              type={"text"}
              placeholder="Username"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string | undefined): void =>
                setLoginData({ ...loginData, username: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") loginHandler();
                },
              }}
            />
            <InputBox
              id={"login-password"}
              value={loginData?.password || ""}
              type={"password"}
              placeholder="Password"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string): void =>
                setLoginData({ ...loginData, password: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") loginHandler();
                },
              }}
            />

            <button className="auth-button" onClick={loginHandler}>
              Login
            </button>
          </div>
          <div className="auth-form" id="signup-form">
            <h2 className="auth-heading">{"Sign Up"}</h2>
            <InputBox
              value={signUpData?.name || ""}
              id={"signup-name"}
              type={"text"}
              placeholder="Name"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string) =>
                setSignUpData({ ...signUpData, name: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") signUpHandler();
                },
              }}
            />
            <InputBox
              value={signUpData?.email || ""}
              id={"signup-email"}
              type={"email"}
              placeholder="Email"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string) =>
                setSignUpData({ ...signUpData, email: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") signUpHandler();
                },
              }}
            />
            <InputBox
              value={signUpData?.username || ""}
              id={"signup-username"}
              type={"text"}
              placeholder="Username"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string) =>
                setSignUpData({ ...signUpData, username: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") signUpHandler();
                },
              }}
            />
            <InputBox
              value={signUpData?.password || ""}
              id={"signup-password"}
              type={"text"}
              placeholder="Password"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string) =>
                setSignUpData({ ...signUpData, password: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") signUpHandler();
                },
              }}
            />
            <InputBox
              value={signUpData?.confirmPassword || ""}
              id={"signup-confirm-password"}
              type={"text"}
              placeholder="Confirm Password"
              isDisabled={false}
              className="auth-input w-100"
              onChange={(value: string) =>
                setSignUpData({ ...signUpData, confirmPassword: value })
              }
              otherProps={{
                onKeyDown: (event: React.KeyboardEvent): void => {
                  if (event?.key === "Enter") signUpHandler();
                },
              }}
            />
            <button className="auth-button" onClick={signUpHandler}>
              {"Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
