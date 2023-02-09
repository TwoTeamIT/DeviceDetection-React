import { useCallback, useEffect, useRef, useState } from "react";
import {
  ColorPicker,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Panel,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import Colors from "../components/utility/brand-identity/Colors.js";
import Font from "../components/utility/brand-identity/Font.js";
import Image from "../components/utility/brand-identity/Image.js";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const getSettings = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/brand/get-settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const saveSettings = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/brand/save-settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const updateImage = async (token, body, setConnFailed) => {
  fetch(API.BASE_URL + "/brand/update-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  }).catch(() => setConnFailed(true));
};

const BrandIdentity = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const updateColor = useCallback((ev, colorObj) => setColor(colorObj), []);
  const [color, setColor] = useState("");
  const [colorFunction, setColorFunction] = useState(null);

  const [fontURL, setFontURL] = useState("");
  const [fontName, setFontName] = useState("");

  const [textColor, setTextColor] = useState("");
  const [bgColor, setBGColor] = useState("");

  const [textColorSidebar, setTextColorSidebar] = useState("");
  const [bgColorSidebar, setBGColorSidebar] = useState("");

  const [textColorButton, setTextColorButton] = useState("");
  const [bgColorButton, setBGColorButton] = useState("");

  const inputLogoRef = useRef(null);
  const inputLogoSidebarRef = useRef(null);
  const inputIconRef = useRef(null);
  const [logoSrc, setLogo] = useState("");
  const [logoNavbarSrc, setLogoNavbar] = useState("");
  const [faviconSrc, setFavicon] = useState("");

  const [formState, setFormState] = useState("unchanged");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(MessageBarType.success);
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (formState !== "unchanged") {
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }
    return () => {};
  }, [formState]);

  useEffect(() => {
    getSettings(token, setConnFailed).then((settings) =>
      initializeColors(settings)
    );
  }, [token]);

  const initializeColors = (data) => {
    setFontURL(data.FontURL);
    setFontName(data.FontName);
    setTextColor(data.Color);
    setBGColor(data.BG);
    setTextColorSidebar(data.SidebarColor);
    setBGColorSidebar(data.SidebarBG);
    setTextColorButton(data.BtnColor);
    setBGColorButton(data.BtnBG);
  };

  const setNewColor = () => {
    switch (colorFunction) {
      case "Brand_colors_text":
        setTextColor(color.str);
        break;
      case "Brand_colors_bg":
        setBGColor(color.str);
        break;
      case "Brand_sidebar_colors_text":
        setTextColorSidebar(color.str);
        break;
      case "Brand_sidebar_colors_bg":
        setBGColorSidebar(color.str);
        break;
      case "Brand_button_colors_text":
        setTextColorButton(color.str);
        break;
      case "Brand_button_colors_bg":
        setBGColorButton(color.str);
        break;

      default:
        break;
    }
  };

  const setMessageVariables = (text, type) => {
    setMessage(text);
    setMessageType(type);
    toggleShowMessage();

    setTimeout(() => {
      toggleShowMessage();
    }, 3000);
  };

  if (connFailed)
    return (
      <div>
        <p className="m-2 text-danger">{t("ConnectionFailed")}</p>
      </div>
    );

  return (
    <div className="px-3 px-sm-5 py-2">
      <Panel
        headerText={t("Color_picker")}
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel={t("Close")}
      >
        <div>
          <ColorPicker
            className="mx-auto"
            color={color}
            showPreview={true}
            onChange={updateColor}
          />
          <DefaultButton
            className="btn-custom mt-3"
            text={t("Save")}
            iconProps={{ iconName: "Save" }}
            onClick={() => {
              setNewColor();
              setFormState("modified");
              dismissPanel();
            }}
          />
        </div>
      </Panel>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFormState("saving");
          let settings = {
            color: textColor,
            bg: bgColor,
            sidebarColor: textColorSidebar,
            sidebarBG: bgColorSidebar,
            btnColor: textColorButton,
            btnBG: bgColorButton,
            fontURL: fontURL,
            fontName: fontName,
          };
          saveSettings(token, settings, setConnFailed).then((res) => {
            setFormState("unchanged");
            console.log(res);
            if (res.success) {
              setMessageVariables(t("Success_save"), MessageBarType.success);
            } else setMessageVariables(t("Error_save"), MessageBarType.error);
          });

          if (logoSrc !== "")
            updateImage(
              token,
              { item1: "logo.png", item2: logoSrc },
              setConnFailed
            );
          if (logoNavbarSrc !== "")
            updateImage(
              token,
              {
                item1: "logo_navbar.png",
                item2: logoNavbarSrc,
              },
              setConnFailed
            );
          if (faviconSrc !== "")
            updateImage(
              token,
              { item1: "favicon.ico", item2: faviconSrc },
              setConnFailed
            );
        }}
      >
        <div className="pt-2 d-flex flex-wrap align-items-start">
          <DefaultButton
            className="btn-custom"
            text={t("Save")}
            type="submit"
            iconProps={{ iconName: "Save" }}
          />
        </div>
        {showMessage && (
          <MessageBar
            className="my-3"
            delayedRender={false}
            messageBarType={messageType}
            isMultiline={false}
            dismissButtonAriaLabel={t("Close")}
            dismissIconProps={{ iconName: "ChromeClose" }}
            onDismiss={() => {
              toggleShowMessage();
            }}
          >
            {message}
          </MessageBar>
        )}
        <div className="mt-3 mb-5">
          <div className="text-divider fs-3 mb-3 color-custom fw-bold">
            {t("Font")}
          </div>
          <Font
            fontURL={fontURL}
            setFontURL={setFontURL}
            fontName={fontName}
            setFontName={setFontName}
          />
        </div>
        <div>
          <div className="text-divider fs-3 mb-3 color-custom fw-bold">
            {t("Colors")}
          </div>
          <div className="mb-5">
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-4 d-flex justify-content-center align-items-center text-center fs-5 fw-bold color-custom">
                {t("Brand_colors")}
              </div>
              <Colors
                textColor={textColor}
                bgColor={bgColor}
                setColor={setColor}
                openPanel={openPanel}
                titleName={"Brand_colors"}
                setColorFunction={setColorFunction}
              />
            </div>
          </div>
          <div className="mb-5">
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-4 d-flex justify-content-center align-items-center text-center fs-5 fw-bold color-custom">
                {t("Brand_sidebar_colors")}
              </div>
              <Colors
                textColor={textColorSidebar}
                bgColor={bgColorSidebar}
                setColor={setColor}
                openPanel={openPanel}
                titleName={"Brand_sidebar_colors"}
                setColorFunction={setColorFunction}
              />
            </div>
          </div>
          <div className="mb-5">
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-4 d-flex justify-content-center align-items-center text-center fs-5 fw-bold color-custom">
                {t("Brand_button_colors")}
              </div>
              <Colors
                textColor={textColorButton}
                bgColor={bgColorButton}
                setColor={setColor}
                openPanel={openPanel}
                titleName={"Brand_button_colors"}
                setColorFunction={setColorFunction}
              />
            </div>
          </div>
        </div>
        <div className="text-divider fs-3 mb-3 color-custom fw-bold">
          {t("Logos")}
        </div>
        <div className="d-flex flex-wrap mb-5">
          <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex flex-column align-items-center">
            <div className="text-center fs-5 fw-bold color-custom">
              {t("Brand_logo")}
            </div>
            <Image
              inputFileRef={inputLogoRef}
              image="/logo.png"
              imageSRC={logoSrc}
              setImageSRC={setLogo}
            />
          </div>
          <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex flex-column align-items-center">
            <div className="text-center fs-5 fw-bold color-custom">
              {t("Brand_navbar_logo")}
            </div>
            <Image
              inputFileRef={inputLogoSidebarRef}
              image="/logo_navbar.png"
              imageSRC={logoNavbarSrc}
              setImageSRC={setLogoNavbar}
            />
          </div>
          <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex flex-column align-items-center">
            <div className="text-center fs-5 fw-bold color-custom">
              {t("Brand_icon")}
            </div>
            <Image
              inputFileRef={inputIconRef}
              image="/favicon.ico"
              imageSRC={faviconSrc}
              setImageSRC={setFavicon}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BrandIdentity;
