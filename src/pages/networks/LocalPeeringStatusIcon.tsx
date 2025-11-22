import type { FC } from "react";
import { Icon } from "@canonical/react-components";
import type { LxdNetworkPeer } from "types/network";

interface Props {
  localPeer: LxdNetworkPeer;
}

const LocalPeeringStatusIcon: FC<Props> = ({ localPeer }) => {
  const getIconNameForStatus = (status: string) => {
    return (
      {
        Pending: "status-waiting-small",
        Created: "status-succeeded-small",
      }[status] ?? ""
    );
  };

  return (
    <>
      <Icon
        name={getIconNameForStatus(localPeer.status)}
        className="status-icon"
      />
      {localPeer.status}
    </>
  );
};

export default LocalPeeringStatusIcon;
