import i18next from "i18next";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <span className="fw-bold">
      &copy; {new Date().toLocaleDateString(i18next.language)} -
      <span runat="server"> {t("Powered_by")} </span>
      <a
        className="color-custom"
        href="https://www.twoteam.it/"
        target="_blank"
        rel="noreferrer"
      >
        TwoTeam
      </a>
    </span>
  );
};

export default Footer;
