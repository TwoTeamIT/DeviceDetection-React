import {
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  TextField,
} from "@fluentui/react";
import { useEffect, useRef, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { useTranslation } from "react-i18next";
import DeviceInfo from "./components/DeviceInfo";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import API from "./configurations/apiConfig.json";
import { useNavigate } from "react-router-dom";

const saveInfo = async (body, setConnFailed) => {
  return fetch(API.BASE_URL + "/detection/save-user-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const getDeviceInfo = async (body, setConnFailed) => {
  return fetch(API.BASE_URL + "/detection/get-device-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const getNumberID = async (number, setConnFailed) => {
  return fetch(API.BASE_URL + "/detection/get-number-id?number=" + number, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const getUserInfo = async (body, setConnFailed) => {
  return fetch(API.BASE_URL + "/send-sms/get-user-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((res) => {
      return res;
    })
    .catch(() => setConnFailed(true));
};

const Default = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [connFailed, setConnFailed] = useState(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);

  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);
  const [messageType, setMessageType] = useState();
  const [message, setMessage] = useState("");

  const name = useRef();
  const last_name = useRef();
  const email = useRef();
  const notes = useRef();

  useEffect(() => {
    setLoading(true);

    var phoneNumber = window.location.search.substring(
      window.location.search.indexOf("snmbr=") + 6,
      window.location.search.indexOf("&")
    );
    var batchId = window.location.search.substring(
      window.location.search.indexOf("batchId=") + 8
    );
    
    if (!validatePhoneNumber(phoneNumber))
      navigate("/error", {
        state: {
          error: t("Phone_number_error").replace("[]", phoneNumber),
          message: t("Error_nan"),
        },
      });

    getNumberID(phoneNumber, setConnFailed).then((id) => {
      if (!id > 0)
        navigate("/error", {
          state: {
            error: t("Phone_number_error_db").replace("[]", phoneNumber),
            message: t("Error_nan"),
          },
        });

      getUserInfo({ ID: id, BatchId: batchId }, setConnFailed).then((res) => {
        if (res) setShowDeviceInfo(true);
        setLoading(false);
      });
    });

    let info = {
      UserAgent: navigator.userAgent,
      Resolution:
        window.screen.width +
        "-" +
        window.screen.height +
        "-" +
        devicePixelRatio,
    };

    getDeviceInfo(info, setConnFailed).then((res) => {
      setUserInfo(res);

      if (res.device.deviceType === "desktop")
        navigate("/error", {
          state: {
            error: t("Error_desktop"),
            message: t("Supported_device"),
          },
        });
    });
  }, []);

  const validatePhoneNumber = (number) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    return re.test(number);
  };

  const setMessageVariables = (text, type) => {
    setMessage(text);
    setMessageType(type);
    toggleShowMessage();

    setTimeout(() => {
      toggleShowMessage();
    }, 3000);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let info = {
      FirstName: name.current.value,
      LastName: last_name.current.value,
      Email: email.current.value,
      NoteMessage: notes.current.value,
      PhoneNumber: window.location.search.substring(
        window.location.search.indexOf("snmbr=") + 6,
        window.location.search.indexOf("&")
      ),
      BatchId: window.location.search.substring(
        window.location.search.indexOf("batchId=") + 8
      ),
      Browser: userInfo.device.browserClient.match.name,
      DeviceType: userInfo.device.deviceType,
      OsInfo: userInfo.device.osInfo.match.name,
      BrandName: userInfo.device.brandName,
      DeviceModel: userInfo.device.modelName,
      UserAgent: navigator.userAgent,
      Resolution:
        window.screen.width +
        "-" +
        window.screen.height +
        "-" +
        devicePixelRatio,
    };
    saveInfo(info, setConnFailed).then((res) => {
      console.log(res);
      if (res > 0)
        setMessageVariables(t("Save_success"), MessageBarType.success);
      else if (res === 0 || res === -1)
        setMessageVariables(t("Save_error"), MessageBarType.error);
      else
        navigate("/error", {
          state: {
            error: t("Phone_number_save_error_db").replace(
              "[]",
              window.location.search.substring(
                window.location.search.indexOf("snmbr=") + 6,
                window.location.search.indexOf("&")
              )
            ),
            message: t("Error_db"),
          },
        });
    });

    setShowDeviceInfo(true);
  };

  if (connFailed)
    return (
      <div>
        <p className="m-2 text-danger">{t("ConnectionFailed")}</p>
      </div>
    );

  return (
    <div>
      <Navbar adminPanel={false} />
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
      {loading ? (
        <>
          <Spinner
            className="my-4"
            label={t("Loading")}
            labelPosition="top"
            size={SpinnerSize.large}
          />
        </>
      ) : !showDeviceInfo ? (
        <div className="my-3 m-auto" style={{ width: "90%" }}>
          <div className="text-center mb-3">{t("Contact_info")}</div>
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <TextField
              ref={name}
              className="mb-3"
              label={t("Name")}
              autoComplete="current"
              required
            />
            <TextField
              ref={last_name}
              className="mb-3"
              label={t("Last_name")}
              autoComplete="current"
              required
            />
            <TextField
              ref={email}
              className="mb-3"
              label={t("Email")}
              required
            />
            <TextField
              ref={notes}
              className="mb-3"
              label={t("Notes")}
              multiline
              required
            />
            <div className="mt-4 d-flex justify-content-center">
              <DefaultButton
                className="btn-custom mb-3"
                text={t("Send")}
                type="submit"
              />
            </div>
          </form>
        </div>
      ) : (
        <DeviceInfo user_info={userInfo} />
      )}
      <div className="d-flex justify-content-center">
        <Footer />
      </div>
    </div>
  );
};

export default Default;
