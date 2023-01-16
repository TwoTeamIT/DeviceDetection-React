import { Icon } from "@fluentui/react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ toggleSidebarText, appToken }) => {
  const { t } = useTranslation();
  const role = appToken
    ? appToken["user"].type
    : window.localStorage.getItem("role");

  return (
    <div className="h-100 bg-custom-sidebar" style={{ minHeight: "100vh" }}>
      <div className="sticky-top">
        <div
          className="sidebar-title align-items-center justify-content-center d-none d-md-flex"
          style={{ height: "75px" }}
        >
          <div className="w-25 fs-5 text-center">
            <Icon
              iconName="BulletedListText"
              style={{ cursor: "pointer" }}
              onClick={toggleSidebarText}
            />
          </div>
          <div className="w-75 fs-5 d-none d-md-block">
            <a href="/" className="text-decoration-none">
              {t("Device_Detection")}
            </a>
          </div>
        </div>
        <div className="sidebar-menu d-flex pt-4 pt-md-0 flex-column">
          <a
            href="/sms-service"
            className="link-export d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
            title={t("Sms_service")}
          >
            <div className="w-25 text-center">
              <Icon iconName="Settings" />
            </div>
            <div className="w-75 d-none d-md-block">{t("Sms_service")}</div>
          </a>
          <a
            href="/number-management"
            className="link-import d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
            title={t("Number_management")}
          >
            <div className="w-25 text-center">
              <Icon iconName="CellPhone" />
            </div>
            <div className="w-75 d-none d-md-block">
              {t("Number_management")}
            </div>
          </a>
          <a
            href="/message-generator"
            className="link-import d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
            title={t("Message_generator")}
          >
            <div className="w-25 text-center">
              <Icon iconName="Mail" />
            </div>
            <div className="w-75 d-none d-md-block">
              {t("Message_generator")}
            </div>
          </a>
          <a
            href="/send-sms"
            className="link-import d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
            title={t("Sms_send")}
          >
            <div className="w-25 text-center">
              <Icon iconName="Send" />
            </div>
            <div className="w-75 d-none d-md-block">{t("Sms_send")}</div>
          </a>
          <div
            className="mb-3 w-75 mx-auto"
            style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
          ></div>
          {role === "0" && (
            <>
              <a
                href="/user-management"
                className="link-user-management d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
                title={t("User_management")}
              >
                <div className="w-25 text-center">
                  <Icon iconName="AccountManagement" />
                </div>
                <div className="w-75 d-none d-md-block">
                  {t("User_management")}
                </div>
              </a>
              <a
                href="/brand-identity"
                className="link-brand-identity d-flex flex-row justify-content-center mb-3 mx-3 py-2 text-decoration-none"
                title={t("Brand_identity")}
              >
                <div className="w-25 text-center">
                  <i
                    className="ms-Icon ms-Icon--Fingerprint"
                    aria-hidden="true"
                  />
                </div>
                <div className="w-75 d-none d-md-block">
                  {t("Brand_identity")}
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
