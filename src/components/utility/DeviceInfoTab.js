import { Image, Label } from "@fluentui/react";

const images = require.context("../images", true);

const DeviceInfoTab = ({ title, imagePath, text }) => {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className="card border-left-primary shadow h-100 py-2">
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold color-custom text-upFpercase mb-1 text-center">
                {title}
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                <div className="d-flex flex-row align-items-center">
                  <Image src={images(`./${imagePath}.png`)} alt="" />
                  <Label as={"pre"} className="ms-3">{text}</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoTab;
