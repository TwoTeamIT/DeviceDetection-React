import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  TextField,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const getSettings = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/sms-service/get-service-message", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((data) => data.text())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const saveSettings = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/sms-service/save-service-message", {
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

const MessageGenerator = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);

  const [formState, setFormState] = useState("unchanged");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(MessageBarType.success);
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);

  const [smsMessage, setSmsMessage] = useState();

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
    getSettings(token, setConnFailed).then((message) => {
      setSmsMessage(message);
    });
  }, [token]);

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFormState("saving");

          saveSettings(token, smsMessage, setConnFailed).then((res) => {
            setFormState("unchanged");
            if (res)
              setMessageVariables(t("Save_success"), MessageBarType.success);
            else setMessageVariables(t("Save_error"), MessageBarType.error);
          });
        }}
      >
        <div className="py-2 d-flex flex-wrap align-items-start">
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

        <div className="my-3">
          <TextField
            label={t("Info_message_generator")}
            value={smsMessage || ""}
            onChange={(e) => {
              setSmsMessage(e.target.value);
              if (formState === "unchanged") setFormState("modified");
            }}
            multiline
            required
          />
        </div>
      </form>
    </div>
  );
};

export default MessageGenerator;
