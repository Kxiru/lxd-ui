import { type FC } from "react";
import { Spinner } from "@canonical/react-components";
import { type TooltipRow } from "components/RichTooltipRow";
import { RichTooltipTable } from "components/RichTooltipTable";
import ResourceLabel from "components/ResourceLabel";
import { Link } from "react-router-dom";
import ItemName from "components/ItemName";
import { useStoragePool } from "context/useStoragePools";
import type { LxdClusterMember } from "types/cluster";
import StoragePoolRichTooltipSize from "./StoragePoolRichTooltipSize";
import type { LxdStoragePool } from "types/storage";

interface Props {
  poolName: string;
  url: string;
  member?: LxdClusterMember;
  location?: string;
}

const StoragePoolRichTooltip: FC<Props> = ({
  poolName,
  url,
  member,
  location,
}) => {
  const { data: pool, isLoading: isPoolLoading } = useStoragePool(poolName);

  if (!pool && !isPoolLoading) {
    return (
      <>
        Storage pool <ResourceLabel type="pool" value={poolName} bold /> not
        found
      </>
    );
  }

  const rows: TooltipRow[] = [
    {
      title: "Storage pool",
      value: pool ? (
        <Link
          to={url}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ItemName item={{ name: poolName }} />
        </Link>
      ) : (
        <Spinner />
      ),
      valueTitle: poolName,
    },
    {
      title: "Description",
      value: pool?.description || "-",
      valueTitle: pool?.description || "-",
    },
    {
      title: "Status",
      value: pool ? pool.status : "-",
    },
    {
      title: "Driver",
      value: pool ? pool.driver : "-",
    },
    {
      title: "Size",
      value: (
        <StoragePoolRichTooltipSize
          pool={pool ?? ({} as LxdStoragePool)}
          member={member}
          location={location}
        />
      ),
      valueTitle: "Size",
    },
    {
      title: "Used by",
      value: pool ? pool.used_by?.length : "-",
    },
  ];

  return (
    <RichTooltipTable rows={rows} className="storage-pool-rich-tooltip-table" />
  );
};

export default StoragePoolRichTooltip;
