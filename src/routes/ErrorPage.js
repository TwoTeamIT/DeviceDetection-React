import { Label } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ErrorPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { error, message } = state;
  console.log(state);

  return (
    <div>
      <Navbar adminPanel={false} />
      <div className="my-5 text-center">
        <Label as={"div"}>{t("Error")}</Label>
        <Label as={"p"} className="mb-4">
          {t("Generic_error")}
        </Label>
        <div className="mb-4 d-flex flex-column align-items-center">
          <Label className="fw-bold w-50">{error}</Label>
          <Label>{message}</Label>
        </div>
        <a href="mailto:support@twoteam.it">{t("Contact_us")}</a>
      </div>
      <div className="d-flex justify-content-center">
        <Footer />
      </div>
    </div>
  );
};

export default ErrorPage;
