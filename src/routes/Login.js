import { useRef } from "react";
import { DefaultButton, Label, TextField } from "@fluentui/react";
import LanguageSelect from "../components/utility/LanguageSelect";
import { useTranslation } from "react-i18next";

const Login = ({ login, loginError }) => {
  const { t } = useTranslation();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    let username = usernameRef.current.value;
    let password = passwordRef.current.value;

    login({
      username,
      password,
    });
  };

  return (
    <div className="vh-100 d-flex flex-column flex-sm-row h-100">
      <div className="col-12 col-sm-5 py-5 d-flex align-items-center bg-custom">
        <img className="w-100 p-3" src="/logo.png" alt="Logo" />
      </div>

      <div className="col-12 col-sm-7">
        <div className=" h-100 p-4 d-flex flex-column justify-content-center">
          <div className="position-absolute p-3 top-0 end-0">
            <LanguageSelect />
          </div>
          <form onSubmit={onSubmit}>
            <TextField
              ref={usernameRef}
              label={t("Username")}
              autoComplete="username"
              required
            />
            <TextField
              ref={passwordRef}
              label={t("Password")}
              type="password"
              autoComplete="current-password"
              canRevealPassword
              required
              revealPasswordAriaLabel={t("Show_password")}
            />
            <DefaultButton
              text="Login"
              type="submit"
              className="mt-3 btn-custom"
              iconProps={{ iconName: "Save" }}
            />
            <Label className="position-fixed text-danger">{loginError}</Label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
