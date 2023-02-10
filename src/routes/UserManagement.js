import { useEffect, useState } from "react";
import {
  DefaultButton,
  DetailsList,
  DetailsRow,
  Dropdown,
  MessageBar,
  MessageBarType,
  Panel,
  SearchBox,
  Selection,
  SelectionMode,
  TextField,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useTranslation } from "react-i18next";

import API from "../configurations/apiConfig.json";

const loadUsers = async (token, setConnFailed) => {
  return fetch(API.BASE_URL + "/user/all", {
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

const createUser = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/user/add", {
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

const updateUser = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/user/update", {
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

const deleteUser = async (token, body, setConnFailed) => {
  return fetch(API.BASE_URL + "/user/delete", {
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

const UserManagement = ({ token }) => {
  const { t } = useTranslation();
  const [connFailed, setConnFailed] = useState(false);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [panelTitle, setPanelTitle] = useState("");
  const [items, setItems] = useState([]);
  //const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [usernameField, setUsername] = useState("");
  const [passwordField, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(undefined);
  const [enabledField, setEnabled] = useState(true);
  const [error, setError] = useState("");
  const [showMessage, { toggle: toggleShowMessage }] = useBoolean(false);
  const [selection] = useState(new Selection());

  const roles = [
    { key: 0, text: t("Admin") },
    { key: 1, text: t("Editor") },
    { key: 2, text: t("Reader") },
  ];

  const enabled = [
    { key: true, text: t("True") },
    { key: false, text: t("False") },
  ];

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
      key: "username",
      name: t("Username"),
      fieldName: "userName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "type",
      name: t("Role"),
      fieldName: "type",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "enabled",
      name: t("Enabled"),
      fieldName: "enabled",
      minWidth: 55,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  useEffect(() => {
      (async () => {
        loadUsers(token, setConnFailed).then((users) => {
          users.forEach((e) => {
            e.type = roles.filter((x) => x.key === e.type)[0].text;
            e.enabled = t(
              e.isEnabled.toString().charAt(0).toUpperCase() +
                e.isEnabled.toString().slice(1)
            );
          });
          //setAllItems(users);
          setItems(users);
        });
      })();
  });

  const resetValues = () => {
    selection.setAllSelected(false);
    setSelectedItem(null);
    setUsername("");
    setPassword("");
    setError("");
  };

  const setResult = (res, error) => {
    if (res) {
      dismissPanel();
      toggleShowMessage();
      resetValues();

      setTimeout(() => {
        toggleShowMessage();
      }, 2000);
    } else {
      setError(error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let user = {
      id: selectedItem ? selectedItem.id : 0,
      userName: usernameField,
      password: passwordField,
      type: selectedRole,
      isEnabled: enabledField,
    };

    if (user.id === 0)
      createUser(token, user, setConnFailed).then((res) => {
        setResult(res, t("Save_error"));
      });
    else
      updateUser(token, user, setConnFailed).then((res) => {
        setResult(res, t("Save_error"));
      });
  };

  if (connFailed)
    return (
      <div>
        <p className="m-2 text-danger">{t("ConnectionFailed")}</p>
      </div>
    );

  return (
    <div className="px-3 px-sm-5 py-2">
      <div className="py-2 d-flex flex-wrap align-items-start">
        {/*
        <SearchBox
          className="me-2 my-1"
          placeholder={t("Search")}
          onChange={(e, text) => {
            text
              ? setItems(
                items.filter(
                  (i) => i.userName.toLowerCase().indexOf(text) > -1
                  )
                )
              : setItems(allItems);
          }}
        />
                  */}
        <DefaultButton
          className="btn-custom"
          text={t("Add_new_user")}
          iconProps={{ iconName: "Add" }}
          onClick={() => {
            setPanelTitle(t("New_user"));
            setSelectedRole(roles[2].key);
            setEnabled(enabled[0].key);
            openPanel();
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
              label={t("Username")}
              autoComplete="username"
              value={usernameField}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className="mb-3"
              label={t("Password")}
              type="password"
              canRevealPassword
              revealPasswordAriaLabel={t("Show_password")}
              autoComplete="current-password"
              value={passwordField}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Dropdown
              className="mb-3"
              label={t("Role")}
              options={roles}
              onChange={(e, i) => {
                setSelectedRole(i.key);
              }}
              selectedKey={selectedRole}
            />
            <Dropdown
              className="mb-3"
              label={t("Enabled")}
              options={enabled}
              onChange={(e, i) => {
                setEnabled(i.key);
              }}
              selectedKey={enabledField}
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
                className={t("New_user") === panelTitle ? "d-none" : "d-block"}
                iconProps={{ iconName: "Delete" }}
                type="submit"
                onClick={() => {
                  deleteUser(token, selectedItem.userName, setConnFailed).then(
                    (res) => setResult(res, t("Error_delete_user"))
                  );
                }}
              />
            </div>
            <div className="text-danger">{error}</div>
          </form>
        </div>
      </Panel>
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
        <DetailsList
          items={items}
          setKey="username"
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          onRenderRow={(props) => {
            return (
              <DetailsRow
                {...props}
                onClick={() => {
                  setPanelTitle(t("Edit_user"));
                  setSelectedItem(props.item);
                  setUsername(props.item.userName);
                  setSelectedRole(
                    roles.filter((x) => x.text === props.item.type)[0].key
                  );
                  setEnabled(
                    enabled.filter((x) => x.key === props.item.isEnabled)[0].key
                  );
                  openPanel();
                }}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default UserManagement;
