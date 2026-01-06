import type { FC } from "react";
import type { LxdInstance } from "types/instance";
import ClusterMemberRichChip from "pages/cluster/ClusterMemberRichChip";

interface Props {
  instance: LxdInstance;
}

const InstanceClusterMemberChip: FC<Props> = ({ instance }) => {
  return <ClusterMemberRichChip clusterName={instance.location} />;
};

export default InstanceClusterMemberChip;
