import { useTranslation } from "react-i18next";

const Colors = ({
  textColor,
  bgColor,
  setColor,
  openPanel,
  titleName,
  setColorFunction,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="col-6 col-md-4 d-flex flex-column align-items-center">
        <label>{t("Text_color")}</label>
        <div
          className="shadow mt-1"
          style={{
            width: "50px",
            height: "30px",
            borderRadius: "10%",
            backgroundColor: textColor,
          }}
          onClick={(e) => {
            setColor(e.target.style.backgroundColor);
            setColorFunction(titleName + "_text");
            openPanel();
          }}
        ></div>
      </div>
      <div className="col-6 col-md-4 d-flex flex-column align-items-center">
        <label>{t("Background_color")}</label>
        <div
          className="shadow mt-1"
          style={{
            width: "50px",
            height: "30px",
            borderRadius: "10%",
            backgroundColor: bgColor,
          }}
          onClick={(e) => {
            setColor(e.target.style.backgroundColor);
            setColorFunction(titleName + "_bg");
            openPanel();
          }}
        ></div>
      </div>
    </>
  );
};

export default Colors;
