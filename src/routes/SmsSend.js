import {
  DefaultButton,
  DetailsList,
  SelectionMode,
  Selection,
  Panel,
  MessageBarType,
  MessageBar,
  TextField,
  SearchBox,
  Dropdown,
  Checkbox,
  MarqueeSelection,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const send =  async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/send-sms", {
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

const getMessage = async (token, setConnFailed) => {
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

const getBatchIds = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/send-sms/get-batch-ids", {
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

const SmsSend = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [error, setError] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sBatchId, setsBatchId] = useState("-1");
  const [delta, setDelta] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [allNumbers, setAllNumbers] = useState([]);
  const [, setSelectedItems] = useState();
  const [batchIds, setBatchIds] = useState();
  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        setSelectedItems(selection.getSelection());
      },
      selectionMode: SelectionMode.multiple,
    })
  );

  const columns = [
    /*{
      key: "id",
      name: "ID",
      fieldName: "id",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },*/
    {
      key: "phoneNumber",
      name: t("Phone_number"),
      fieldName: "phoneNumber",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  const setResult = (res) => {
    if (res) {
      dismissPanel();
      toggleShowMessage();

      setTimeout(() => {
        toggleShowMessage();
      }, 2000);
    } else {
      setError(t("Save_error"));
    }
  };

  useEffect(() => {
    getNumbers(token, setConnFailed).then((res) => {
      setNumbers(res);
      setAllNumbers(res);
    });

    getMessage(token, setConnFailed).then((res) => {
      setSendMessage(res);
    });

    getBatchIds(token, setConnFailed).then((res) => {
      var tempBatchIds = [{ key: "-1", text: t("New_batch_id") }];
      res.forEach((e) => {
        tempBatchIds.push({ key: e, text: e });
      });
      setBatchIds(tempBatchIds);
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
        <SearchBox
          className="me-2 my-1"
          placeholder={t("Search")}
          onChange={(e, text) => {
            text
              ? setNumbers(
                  numbers.filter(
                    (i) => i.phoneNumber.toLowerCase().indexOf(text) > -1
                  )
                )
              : setNumbers(allNumbers);
          }}
        />
        <DefaultButton
          className="btn-custom ms-auto"
          text={t("Sms_send")}
          iconProps={{ iconName: "Send" }}
          disabled={selection.count > 0 ? false : true}
          onClick={() => {
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
        <MarqueeSelection selection={selection}>
          <DetailsList
            setKey="phoneNumber"
            items={numbers}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.multiple}
            selectionPreservedOnEmptyClick={true}
          />
        </MarqueeSelection>
      </div>
      <Panel
        headerText={t("Send_sms_options")}
        isOpen={isOpen}
        onDismiss={() => {
          dismissPanel();
        }}
        closeButtonAriaLabel={t("Close")}
      >
        <div className="mt-2">
          <TextField
            className="mb-3"
            label={t("Message")}
            defaultValue={sendMessage}
            multiline
            disabled
          />
          <Dropdown
            className="mb-3"
            options={batchIds}
            defaultSelectedKey={batchIds ? batchIds[0].key : null}
            onChange={(event, option) => setsBatchId(option.key)}
          />
          <Checkbox
            label={t("Send_delta")}
            onChange={(event, isChecked) => setDelta(isChecked)}
          />
          <span className="ms-Checkbox-text text-236 text-info ms-0 mb-3">
            {t("Send_delta_info")}
          </span>
          <div className="pt-2 mb-3 d-flex flex-wrap justify-content-between">
            <DefaultButton
              className="btn-custom"
              text={t("Send")}
              iconProps={{ iconName: "Send" }}
              onClick={() => {
                let sendModel = {
                  BatchId: sBatchId,
                  Delta: delta,
                  Message: sendMessage,
                  Numbers: selection.getSelection(),
                };

                send(token, sendModel, setConnFailed).then((res) =>
                  setResult(res)
                );
              }}
            />
          </div>
          <div className="text-danger">{error}</div>
        </div>
      </Panel>
    </div>
  );
};

export default SmsSend;
