import { TextField } from "@fluentui/react";
import { useTranslation } from "react-i18next";

const Font = ({ fontURL, fontName, setFontURL, setFontName }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap">
      <div className="col-12 col-md-6">
        <TextField
          label={t("Font_url")}
          value={fontURL}
          onChange={(e) => setFontURL(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-6">
        <TextField
          label={t("Font_name")}
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Font;
