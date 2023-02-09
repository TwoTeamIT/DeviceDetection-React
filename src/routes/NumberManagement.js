import {
  DefaultButton,
  DetailsList,
  SelectionMode,
  Selection,
  Panel,
  MessageBarType,
  MessageBar,
  TextField,
  DetailsRow,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const getNumbers = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/numbers/get", {
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

const addNumber = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/numbers/add?number=" + body, {
    method: "POST",
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

const updateNumber = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/numbers/update", {
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

const deleteNumber = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/numbers/delete?id=" + body, {
    method: "POST",
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

const NumberManagement = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);

  const [numbers, setNumbers] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [selection] = useState(new Selection());

  const [panelTitle, setPanelTitle] = useState("");
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const columns = [
    /*{
      key: "1",
      name: "ID",
      fieldName: "id",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },*/
    {
      key: "2",
      name: t("Phone_number"),
      fieldName: "phoneNumber",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  const resetValues = () => {
    selection.setAllSelected(false);
    setSelectedItem(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let num = {
      id: selectedItem ? selectedItem.id : 0,
      phoneNumber: phoneNumber,
    };

    if (num.id === 0)
      addNumber(token, num.phoneNumber, setConnFailed).then((res) => {
        setResult(res);
      });
    else
      updateNumber(token, num, setConnFailed).then((res) => {
        setResult(res);
      });
  };

  const setResult = (res) => {
    if (res) {
      dismissPanel();
      toggleShowMessage();
      resetValues();

      setTimeout(() => {
        toggleShowMessage();
        window.location.reload(false);
      }, 2000);
    } else {
      setError(t("Save_error"));
    }
  };

  useEffect(() => {
    getNumbers(token, setConnFailed).then((res) => {
      setNumbers(res);
    });
  }, [token]);

  if (connFailed)
    return (
      <div>
        <p className="m-2 text-danger">{t("ConnectionFailed")}</p>
      </div>
    );

  return (
    <div className="px-3 px-sm-5 py-2">
      <div className="py-2 d-flex flex-wrap align-items-start">
        <DefaultButton
          className="btn-custom"
          text={t("New_phone_number")}
          iconProps={{ iconName: "Add" }}
          onClick={() => {
            setPanelTitle(t("New_phone_number"));
            setPhoneNumber("");
            openPanel();
          }}
        />
      </div>
      <div>
        {showMessage && (
          <MessageBar
            className="my-3"
            delayedRender={false}
            messageBarType={MessageBarType.success}
            isMultiline={false}
            dismissButtonAriaLabel={t("Close")}
            dismissIconProps={{ iconName: "ChromeClose" }}
            onDismiss={() => {
              toggleShowMessage();
            }}
          >
            {t("Save_success")}
          </MessageBar>
        )}
      </div>
      <div>
        <DetailsList
          items={numbers}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          onRenderRow={(props) => {
            return (
              <DetailsRow
                {...props}
                onClick={() => {
                  setPanelTitle(t("Edit_number"));
                  setSelectedItem(props.item);
                  setPhoneNumber(props.item.phoneNumber);
                  openPanel();
                }}
              />
            );
          }}
        />
      </div>
      <Panel
        headerText={panelTitle}
        isOpen={isOpen}
        onDismiss={() => {
          resetValues();
          dismissPanel();
        }}
        closeButtonAriaLabel={t("Close")}
      >
        <div className="mt-2">
          <form onSubmit={onSubmit}>
            <TextField
              className="mb-3"
              label={t("Phone_number")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="pt-2 mb-3 d-flex flex-wrap justify-content-between">
              <DefaultButton
                className="btn-custom"
                text={t("Save")}
                iconProps={{ iconName: "Save" }}
                type="submit"
              />
              <DefaultButton
                text={t("Delete")}
                className={
                  t("New_phone_number") === panelTitle ? "d-none" : "d-block"
                }
                iconProps={{ iconName: "Delete" }}
                type="submit"
                onClick={() => {
                  deleteNumber(token, selectedItem.id, setConnFailed).then(
                    (res) => setResult(res, t("Error_delete_user"))
                  );
                }}
              />
            </div>
            <div className="text-danger">{error}</div>
          </form>
        </div>
      </Panel>
    </div>
  );
};

export default NumberManagement;
