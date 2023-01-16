import { useTranslation } from "react-i18next";
import LanguageSelect from "./utility/LanguageSelect";

const Navbar = ({ logout }) => {
  const { t } = useTranslation();

  return (
    <div
      className="px-2 px-sm-4 d-flex justify-content-between border-bottom"
      style={{ backgroundColor: "#fff" }}
    >
      <div>
        <a href="/">
          <img src="/logo_navbar.png" alt="logo" height={75} />
        </a>
      </div>
      <div className="d-flex flex-row align-items-center">
        <div className="me-3">
          <LanguageSelect />
        </div>
        <div
          className="d-flex flex-row me-3 color-custom"
          title={t("Logout")}
          style={{ cursor: "pointer" }}
          onClick={() => logout()}
        >
          <i className="ms-Icon ms-Icon--SignOut" aria-hidden="true"></i>
          <div className="d-none d-sm-block ms-1">{t("Logout")}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
