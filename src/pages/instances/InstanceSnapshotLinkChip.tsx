import { FC } from "react";
import ResourceLink from "components/ResourceLink";
import type { PartialWithRequired } from "types/partial";
import type { LxdInstance } from "types/instance";

interface Props {
  name: string;
  instance: PartialWithRequired<LxdInstance, "name" | "project">;
}

const InstanceSnapshotLinkChip: FC<Props> = ({ name, instance }) => {
  return (
    <ResourceLink
      type="snapshot"
      value={name}
      to={`/ui/project/${instance.project}/instance/${instance.name}/snapshots`}
    />
  );
};

export default InstanceSnapshotLinkChip;
