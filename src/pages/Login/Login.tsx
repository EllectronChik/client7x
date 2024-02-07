import React, { useEffect, useState } from "react";
import classes from "./Login.module.scss";
import Button7x from "components/UI/Button7x/Button7x";
import important_svg from "@assets/images/techImages/important.svg";
import { IUserCreate } from "models/IUserCreate";
import { UsersApi } from "services/UserService";
import { useCookies } from "react-cookie";
import Input7x from "components/UI/Input7x/Input7x";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { DeviceCntApi } from "services/DeviceCntService";

interface IErrorData {
  username: string[];
  password: string[];
  re_password: string[];
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [errorData, setErrorData] = useState<IErrorData | null>(null);
  const [Cookie, setCookie] = useCookies(["token", "userId", "have_account"]);
  const navigate = useNavigate();
  const intl = useIntl();

  const [data, setData] = useState<IUserCreate>({
    username: "",
    password: "",
    re_password: "",
  });

  const [createUser, { error: errorCreate }] =
    UsersApi.useRegisterUserMutation();
  const [loginUser, {}] = UsersApi.useLoginUserMutation();
  const [increaseDevices, {}] = DeviceCntApi.usePatchDeviceCntMutation();

  useEffect(() => {
    document.title = isLogin
      ? `${intl.formatMessage({ id: "signUp" })}`
      : `${intl.formatMessage({ id: "signIn" })}`;
  }, [isLogin]);

  useEffect(() => {
    if (Cookie.userId) {
      navigate("/account");
    }
    setIsLogin(Cookie.have_account ? false : true);
  }, []);

  useEffect(() => {
    if (
      errorCreate &&
      "data" in errorCreate &&
      typeof errorCreate.data === "object" &&
      errorCreate.data !== null
    ) {
      setErrorData(errorCreate.data as IErrorData);
    }
  }, [errorCreate]);

  const verify_registration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createUser(data);
    await verify_login(e);
  };

  const verify_login = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const exp_date = new Date();
      exp_date.setDate(exp_date.getDate() + 21);
      const responce = await loginUser({
        username: data.username,
        password: data.password,
      });
      if ("data" in responce) {
        if (!Cookie.have_account) {
          setCookie("have_account", 1, { maxAge: 60 * 365 * 24 * 60 * 60 });
        }
        setCookie("token", responce.data.auth_token, { expires: exp_date });
        setCookie("userId", responce.data.user_id, { expires: exp_date });
        await increaseDevices({
          token: responce.data.auth_token,
          action: "increase",
        });
        setIsError(null);
        navigate("/account");
      } else if (responce.error) {
        if ("status" in responce.error) {
          if (responce.error.status === 400) {
            setIsError("Incorrect username or password");
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.block}>
        <div className={classes.bttns}>
          <button
            onClick={() => setIsLogin(true)}
            className={`${isLogin ? classes.active : ""} ${classes.btn}`}
          >
            <FormattedMessage id="signUp" />
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`${isLogin ? "" : classes.active} ${classes.btn}`}
          >
            <FormattedMessage id="signIn" />
          </button>
        </div>
        {isLogin ? (
          <form
            className={`${classes.form} ${classes.signUp} ${
              errorData ? classes.errorForm : ""
            }`}
            onSubmit={verify_registration}
          >
            <Input7x
              className={classes.input}
              type="text"
              placeholder={intl.formatMessage({ id: "username" })}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            {errorData && errorData.username && (
              <div className={classes.error}>{errorData?.username}</div>
            )}
            <Input7x
              className={classes.input}
              type="password"
              placeholder={intl.formatMessage({ id: "password" })}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            {errorData && errorData.password && (
              <div className={classes.error}>{errorData?.password}</div>
            )}
            <Input7x
              className={`${classes.input} ${classes.re_password}`}
              type="password"
              placeholder={intl.formatMessage({ id: "re_password" })}
              onChange={(e) =>
                setData({ ...data, re_password: e.target.value })
              }
            />
            {errorData && errorData.re_password && (
              <div className={classes.error}>{errorData?.re_password}</div>
            )}
            <Button7x
              className={`${classes.sub_btn} ${classes.re_password}`}
              type="submit"
            >
              <FormattedMessage id="signUp" />
            </Button7x>
            <div className={`${classes.important} ${classes.re_password}`}>
              <img
                src={important_svg}
                className={classes.important_img}
                alt="important"
              />
              <FormattedMessage id="performRegisterMessage" />
            </div>
          </form>
        ) : (
          <form className={`${classes.form} }`} onSubmit={verify_login}>
            <Input7x
              className={classes.input}
              type="text"
              placeholder={intl.formatMessage({ id: "username" })}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <Input7x
              className={classes.input}
              type="password"
              placeholder={intl.formatMessage({ id: "password" })}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            {isError && <p className={classes.error}>{isError}</p>}
            <Button7x
              className={` ${classes.sub_btn} ${classes.re_password}`}
              type="submit"
            >
              <FormattedMessage id="signIn" />
            </Button7x>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
