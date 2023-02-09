import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  TextField,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const getSettings = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/sms-service/get-service-settings", {
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
  return fetch(API.BASE_URL + "/sms-service/save-service-settings", {
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

const SmsService = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);

  const [formState, setFormState] = useState("unchanged");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(MessageBarType.success);
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);

  const [siteUrl, setSiteUrl] = useState();
  const [sendNumber, setSendNumber] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [apiBaseUrl, setApiBaseUrl] = useState();
  const [tinyUrl, setTinyUrl] = useState();

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
    getSettings(token, setConnFailed).then((settings) => {
      loadSettings(settings);
    });
  }, [token]);

  const loadSettings = (settings) => {
    setSiteUrl(settings.landingSiteUrl);
    setSendNumber(settings.senderNumber);
    setUsername(settings.serviceUserName);
    setPassword(settings.serviceUserPwd);
    setApiBaseUrl(settings.apiServiceUrl);
    setTinyUrl(settings.tinyServiceUrl);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFormState("saving");

          let settings = {
            LandingSiteUrl: siteUrl,
            SenderNumber: sendNumber,
            ServiceUserName: username,
            ServiceUserPwd: password,
            ApiServiceUrl: apiBaseUrl,
            TinyServiceUrl: tinyUrl,
          };

          saveSettings(token, settings, setConnFailed).then((res) => {
            setFormState("unchanged");
            if (res)
              setMessageVariables(t("Success_save"), MessageBarType.success);
            else setMessageVariables(t("Error_save"), MessageBarType.error);
          });
        }}
      >
        <div className="my-3">
          <TextField
            label={t("Site_url")}
            value={siteUrl || ""}
            onChange={(e) => {
              setSiteUrl(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
        <div className="mb-3">
          <TextField
            label={t("Send_number")}
            value={sendNumber || ""}
            onChange={(e) => {
              setSendNumber(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
        <div className="mb-3">
          <TextField
            label={t("Sms_service_username")}
            value={username || ""}
            onChange={(e) => {
              setUsername(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
        <div className="mb-3">
          <TextField
            label={t("Sms_service_password")}
            value={password || ""}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
        <div className="mb-3">
          <TextField
            label={t("Api_service_base_url")}
            value={apiBaseUrl || ""}
            onChange={(e) => {
              setApiBaseUrl(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
        <div className="mb-3">
          <TextField
            label={t("Tiny_url_generator")}
            value={tinyUrl || ""}
            onChange={(e) => {
              setTinyUrl(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default SmsService;
