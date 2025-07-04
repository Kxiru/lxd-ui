import type { FC } from "react";
import { isRootDisk } from "util/instanceValidation";
import type { FormDevice } from "util/formDevices";
import type { LxdDeviceValue } from "types/device";
import ResourceLink from "components/ResourceLink";
import { isHostDiskDevice } from "util/devices";

interface Props {
  device: LxdDeviceValue;
  project: string;
}

const DeviceDetails: FC<Props> = ({ device, project }) => {
  if (device.type === "disk") {
    if (isRootDisk(device as FormDevice)) {
      return (
        <>
          Pool{" "}
          <ResourceLink
            type={"pool"}
            value={device.pool || ""}
            to={`/ui/project/${encodeURIComponent(project)}/storage/pool/${encodeURIComponent(device.pool ?? "")}`}
          />
        </>
      );
    }

    if (isHostDiskDevice(device)) {
      return device.source;
    }

    return (
      <>
        Volume{" "}
        <ResourceLink
          type={"volume"}
          value={device.source as string}
          to={`/ui/project/${encodeURIComponent(project)}/storage/pool/${encodeURIComponent(device.pool ?? "")}/volumes/custom/${encodeURIComponent(device.source ?? "")}`}
        />{" "}
        on pool{" "}
        <ResourceLink
          type={"pool"}
          value={device.pool || ""}
          to={`/ui/project/${encodeURIComponent(project)}/storage/pool/${encodeURIComponent(device.pool ?? "")}`}
        />
      </>
    );
  }

  if (device.type === "gpu") {
    return (
      <span title={device.pci} className="u-truncate">
        {device.pci ? `PCI  ${device.pci}` : `ID ${device.id}`}
      </span>
    );
  }

  if (device.type === "proxy") {
    return (
      <>
        <div title={device.listen} className="u-truncate">
          Listen: {device.listen}
        </div>
        <div title={device.connect} className="u-truncate">
          Connect: {device.connect}
        </div>
      </>
    );
  }
  return "-";
};

export default DeviceDetails;
