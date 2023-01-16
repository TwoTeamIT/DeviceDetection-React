import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Dropdown, DropdownMenuItemType } from "@fluentui/react";
import useWindowDimensions from "./useWindowDimensions";

const LanguageSelect = () => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(
    localStorage.getItem("i18nextLng") || "it-IT"
  );
  const { height, width } = useWindowDimensions();

  const languageMap = [
    {
      key: "Select_Language",
      text: t("Select_language"),
      itemType: DropdownMenuItemType.Header,
    },
    {
      key: "it-IT",
      text:
        width > 576
          ? t("Italian")
          : t("Italian", { lng: "en-US" }).substring(0, 2).toUpperCase(),
    },
    {
      key: "en-US",
      text:
        width > 576
          ? t("English")
          : t("English", { lng: "en-US" }).substring(0, 2).toUpperCase(),
    },
  ];

  const onChange = (event, item) => {
    i18next.changeLanguage(item.key);
    setSelectedItem(item.key);
    window.location.reload();
  };

  return (
    <Dropdown
      selectedKey={selectedItem}
      dropdownWidth={135}
      onChange={onChange}
      options={languageMap}
    />
  );
};

export default LanguageSelect;
