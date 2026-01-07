import { type FC } from "react";
import ClusterMemberMemoryUsage from "pages/cluster/ClusterMemberMemoryUsage";
import type { LxdClusterMember } from "types/cluster";
import StoragePoolSize from "./StoragePoolSize";
import type { LxdStoragePool } from "types/storage";

interface Props {
  pool: LxdStoragePool;
  member?: LxdClusterMember;
  location?: string;
}

const StoragePoolRichTooltipSize: FC<Props> = ({ pool, member, location }) => {
  return member && location ? (
    <ClusterMemberMemoryUsage member={member} />
  ) : (
    <StoragePoolSize pool={pool} />
  );
};

export default StoragePoolRichTooltipSize;
