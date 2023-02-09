import { useTranslation } from "react-i18next";
import DeviceInfoTab from "./utility/DeviceInfoTab";

const DeviceInfo = ({ user_info }) => {
  const { t } = useTranslation();

  return (
    <div className="row justify-content-center">
      <DeviceInfoTab
        title={t("Brand_name")}
        imagePath={"brand/" + user_info.device.brandName}
        text={user_info.device.brandName}
      />
      <DeviceInfoTab
        title={t("Device_model")}
        imagePath={"devices/" + user_info.device.deviceType}
        text={user_info.device.modelName}
      />
      <DeviceInfoTab
        title={t("Browser")}
        imagePath={"browsers/" + user_info.device.browserClient.match.shortName}
        text={
          user_info.device.browserClient.match.name +
          "\r\n" +
          t("Version") +
          ": " +
          user_info.device.browserClient.match.version
        }
      />
      <DeviceInfoTab
        title={t("OS")}
        imagePath={"os/" + user_info.device.osInfo.match.shortName}
        text={
          user_info.device.osInfo.match.name +
          "\r\n" +
          t("Version") +
          ": " +
          user_info.device.osInfo.match.version
        }
      />
      <DeviceInfoTab
        title={t("Device_type")}
        imagePath={"devices/" + user_info.device.deviceType}
        text={user_info.device.deviceType}
      />
    </div>
  );
};

export default DeviceInfo;
